// routes/auth.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const generateExcel = require("../models/Excel_generator.js");
const UsersModel = require("../models/users.js");
const Visitor = require("../models/visitors.js");
const VisitorSession = require("../models/visitor_sessions.js");
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const VisitorModel = require("../models/visitors.js");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Types;
const otpStorage = {};

// Function to convert image to base64
const imageToBase64 = (imagePath) => {
  const bitmap = fs.readFileSync(imagePath);
  return `data:image/png;base64,${Buffer.from(bitmap).toString("base64")}`;
};

// Function to generate a random 4-character OTP
const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 4-digit numeric OTP
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No record existed" });
    }

    // Compare provided password with hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Set session data
      req.session.user = {
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(401).json({ message: "The password is incorrect" });
    }
  } catch (err) {
    console.error("User lookup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a 4-character OTP
    const otp = generateOtp();

    // Set OTP expiration time (e.g., 5 minutes from now)
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Store the OTP and its expiration time in otpStorage
    otpStorage[email] = { otp, expiresAt };

    // Here, you would typically send the OTP to the user's email
    // For now, we just return it in the response for testing purposes
    console.log(`Generated OTP for ${email}: ${otp}`); // Log the OTP (for debugging)

    return res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error("Error in /send-otp:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the email exists in the database
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Check if an OTP was generated for this email
    const storedOtpDetails = otpStorage[email];

    if (!storedOtpDetails) {
      return res.status(400).json({ message: "OTP not found for this email" });
    }

    const { otp: storedOtp, expiresAt } = storedOtpDetails;

    // Check if the OTP has expired
    if (Date.now() > expiresAt) {
      delete otpStorage[email]; // Clean up expired OTP
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if the provided OTP matches the stored OTP
    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed with the desired action (e.g., password reset)
    delete otpStorage[email]; // Remove the OTP after successful verification

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    await UsersModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true } // This option returns the modified document
    );

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in /change-password:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/visitors", async (req, res) => {
  try {
    // Fetch all necessary data from MongoDB collections
    const visitors = await Visitor.find({});
    const sessions = await VisitorSession.find({});
    const groups = await VisitorGroup.find({});
    const cards = await VisitorCard.find({});

    // Map through sessions to construct the desired response format
    const result = sessions.map((session) => {
      // Find corresponding visitor and group information
      const visitor = visitors.find((v) => v._id.equals(session.visitor_id));
      const group = groups.find((g) => g._id.equals(session.group_id));
      const groupMembers = group ? group.group_members : ["102", 130];
      const checkOutTimes = groupMembers.map((member) => member.check_out_time);
      let latestCheckOutTime = null;
      if (
        checkOutTimes.length > 0 &&
        checkOutTimes.every((time) => time !== null)
      ) {
        latestCheckOutTime = new Date(
          Math.max(...checkOutTimes.map((time) => new Date(time)))
        );
      }
      // console.log(checkOutTimes);

      // Construct the response object
      return {
        _id: session._id,
        name: visitor ? visitor.name : "Nah", // Ensure visitor.name is properly fetched
        phone_number: visitor ? visitor.phone_number : "Nah", // Ensure visitor.phone_number is properly fetched
        purpose_of_visit: session.purpose_of_visit,
        entry_gate: session.entry_gate,
        check_in_time: session.check_in_time,
        exit_gate: session.exit_gate,
        check_out_time: latestCheckOutTime,
        group_size: session.group_size,
        photos: session.photos, // session.photos,
        visitor_cards: groupMembers
          ? groupMembers
          : [
              { card_id: "404", status: "checked_out" },
              { card_id: "500", status: "checked_in" },
            ],
      };
    });

    // Send the constructed response as JSON
    res.json(result);
  } catch (err) {
    // Handle any errors and send an error response
    console.error("Error fetching visitors:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/phoneNumber", async (req, res) => {
  const { phone_number } = req.query; // Use req.query for GET parameters

  try {
    const visitor = await VisitorModel.findOne({ phone_number: phone_number });

    if (visitor) {
      // visitor found
      const { name } = visitor; // Assuming you want to return the name
      res.json(name || ""); // Return the name or an empty string if name is falsy
    } else {
      // visitor not found
      res.json(""); // Return an empty string if no visitor found
    }
  } catch (err) {
    console.error("Visitor lookup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// New route to handle purpose filtering
router.get("/purpose", async (req, res) => {
  try {
    const query = req.query.query || "";
    const regex = new RegExp(query, "i"); // Case-insensitive regex for matching purposes
    const sessions = await VisitorSession.find({
      purpose_of_visit: regex,
    }).distinct("purpose_of_visit");
    res.json(sessions);
  } catch (err) {
    console.error("Error fetching purposes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/available_id_cards", async (req, res) => {
  try {
    const query = req.query.query || "";
    const regex = new RegExp(query, "i"); // Case-insensitive regex for matching purposes

    // Find visitor cards where card_id matches the regex and status is 'available'
    const cards = await VisitorCard.find({
      card_id: { $regex: regex },
      status: "available",
    }).distinct("card_id");

    res.json(cards); // Return the array of matching card_id values
  } catch (err) {
    console.error("Error fetching card IDs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register_Visitor", (req, res) => {
  try {
    const visitorInput = req.data;
    res.json("");
  } catch (err) {
    console.log("Error in registering visitor session", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/checkIDAvailable", async (req, res) => {
  try {
    const { ID_Array } = req.query;
    const ids = Array.isArray(ID_Array) ? ID_Array : [ID_Array];

    const cards = await VisitorCard.find({ card_id: { $in: ids } });

    const unavailableIds = [];
    cards.forEach((card) => {
      if (card.status !== "available") {
        unavailableIds.push(card.card_id);
      }
    });

    if (unavailableIds.length > 0) {
      res.json({
        checking: false,
        msg: `IDs ${unavailableIds.join(", ")} are not available`,
      });
    } else {
      res.json({ checking: true });
    }
  } catch (err) {
    console.log("Error in checking selected IDs", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/checkVisitorAccessibility", async (req, res) => {
  try {
    const { phone_number } = req.query;

    // Find the visitor by phone number
    const visitor = await VisitorModel.findOne({ phone_number });
    if (!visitor) {
      return res.json({ checking: false, msg: "Visitor not found" });
    }

    // Check if the visitor has an ongoing session
    const ongoingSession = await VisitorSession.findOne({
      visitor_id: visitor._id,
      check_out_time: null,
    });

    if (ongoingSession) {
      return res.json({
        checking: false,
        msg: "Visitor has an ongoing session",
      });
    } else {
      return res.json({ checking: true });
    }
  } catch (err) {
    console.log("Error in checking visitor accessible", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register_Checkin_Visitor", async (req, res) => {
  try {
    // Extract VisitorSessionInfo from req.body.params
    const { VisitorSessionInfo } = req.body.params;

    // Log the extracted object
    console.log("Extracted VisitorSessionInfo:", VisitorSessionInfo);

    const {
      PhoneNumber,
      Name,
      PurposeOfVisit,
      EntryGate,
      GroupSize,
      Checkin_time,
      IdCards,
      Photo,
    } = VisitorSessionInfo;

    if (
      !PhoneNumber ||
      !Name ||
      !PurposeOfVisit ||
      !EntryGate ||
      !GroupSize ||
      !Checkin_time ||
      !IdCards
    ) {
      console.log("Missing required fields:", VisitorSessionInfo);
      return res
        .status(400)
        .json({ checking: false, msg: "Missing required fields" });
    }

    const checkInDate = new Date(Checkin_time);
    if (isNaN(checkInDate.getTime())) {
      console.log("Invalid Checkin_time format:", Checkin_time);
      return res
        .status(400)
        .json({ checking: false, msg: "Invalid Checkin_time format" });
    }

    let ExistingVisitor = true;
    let visitorId = null;

    // Find the visitor by phone number
    const visitor = await VisitorModel.findOne({ phone_number: PhoneNumber });
    if (!visitor) {
      ExistingVisitor = false; // msg: 'Visitor not found'
    } else {
      visitorId = visitor._id;
    }

    // Check if the visitor has an ongoing session
    const ongoingSession = await VisitorSession.findOne({
      visitor_id: visitorId,
      check_out_time: null,
    });

    const ids = Array.isArray(IdCards) ? IdCards : [IdCards];
    const cards = await VisitorCard.find({ card_id: { $in: ids } });

    const unavailableIds = [];
    cards.forEach((card) => {
      if (card.status !== "available") {
        unavailableIds.push(card.card_id);
      }
    });

    cards.forEach((card) => {
      if (card.status === null) {
        unavailableIds.push(card.card_id);
      }
    });

    ids.forEach((card) => {
      if (card === null) {
        unavailableIds.push(card);
      }
    });

    if (unavailableIds.length > 0) {
      return res.json({
        checking: false,
        msg: `IDs ${unavailableIds.join(", ")} are not available`,
      });
    }

    if (ongoingSession) {
      return res.json({
        checking: false,
        msg: "Visitor has an ongoing session",
      });
    }

    if (ExistingVisitor) {
      visitorId = visitor._id;
    } else {
      // Create a new visitor
      const newVisitor = new VisitorModel({
        name: Name,
        phone_number: PhoneNumber,
      });

      const savedVisitor = await newVisitor.save();
      visitorId = savedVisitor._id;
    }

    // Create a new document in visitor_sessions
    const newSession = new VisitorSession({
      _id: new mongoose.Types.ObjectId(),
      visitor_id: visitorId,
      purpose_of_visit: PurposeOfVisit,
      entry_gate: EntryGate,
      check_in_time: checkInDate,
      exit_gate: null,
      check_out_time: null,
      group_size: GroupSize,
      group_id: new mongoose.Types.ObjectId(), // Placeholder for group_id
      photos: Photo,
    });

    await newSession.save();

    // Create a new document in visitor_groups
    const groupMembers = ids.map((id) => ({
      card_id: id,
      check_in_time: checkInDate,
      exit_gate: null,
      check_out_time: null,
      status: "checked_in",
    }));

    const newGroup = new VisitorGroup({
      _id: new mongoose.Types.ObjectId(),
      session_id: newSession._id,
      group_members: groupMembers,
    });

    await newGroup.save();

    // Update the group_id in the session document
    newSession.group_id = newGroup._id;
    await newSession.save();

    // Update visitor_cards with appropriate status and assignments
    await Promise.all(
      groupMembers.map(async (member, index) => {
        await VisitorCard.updateOne(
          { card_id: member.card_id },
          {
            $set: {
              status: "assigned",
              assigned_to: newGroup.group_members[index]._id,
            },
          }
        );
      })
    );

    return res.json({
      checking: true,
      msg: "Visitor check-in processed successfully",
    });
  } catch (err) {
    console.error("Error in Register/Checkin Visitor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Yunus changes

router.get("/checked-in-ids", async (req, res) => {
  try {
    const query = req.query.query || "";
    const regex = new RegExp(query, "i"); // Case-insensitive regex for matching purposes
    // Find visitor cards where card_id matches the regex and status is 'available'
    const cards = await VisitorCard.find({
      card_id: { $regex: regex },
      status: "assigned",
    }).distinct("card_id");
    res.json(cards); // Return the array of matching card_id values
  } catch (err) {
    console.error("Error in checkout availabe card IDs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/checkout-visitor-details", async (req, res) => {
  const { id } = req.query;
  try {
    const result = await VisitorGroup.aggregate([
      {
        $match: {
          group_members: {
            $elemMatch: {
              card_id: id,
              status: "checked_in",
            },
          },
        },
      },
      {
        $lookup: {
          from: "visitor_sessions",
          localField: "session_id",
          foreignField: "_id",
          as: "sessionDetails",
        },
      },
      {
        $unwind: "$sessionDetails",
      },
      {
        $lookup: {
          from: "visitors",
          localField: "sessionDetails.visitor_id",
          foreignField: "_id",
          as: "visitorDetails",
        },
      },
      {
        $unwind: "$visitorDetails",
      },
      {
        $project: {
          name: "$visitorDetails.name",
          phone_number: "$visitorDetails.phone_number",
          purpose_of_visit: "$sessionDetails.purpose_of_visit",
          entry_gate: "$sessionDetails.entry_gate",
          check_in_time: "$sessionDetails.check_in_time",
          group_size: "$sessionDetails.group_size",
          photos: {
            $cond: {
              if: { $gt: [{ $strLenCP: "$sessionDetails.photos" }, 0] },
              then: "$sessionDetails.photos",
              else: "",
            },
          },
          member_details: {
            $map: {
              input: "$group_members",
              as: "member",
              in: {
                card_id: "$$member.card_id",
                status: "$$member.status",
              },
            },
          },
        },
      },
    ]).exec();
    if (result.length === 0) {
      return res.status(404).json({ message: "No matching visitor found." });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Error retrieving visitor details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/checkout-visitor", async (req, res) => {
  const { selectedValues, selectedExit } = req.body;
  const currentTime = new Date();

  // Ensure selectedValues is an array
  const cardIds = Array.isArray(selectedValues)
    ? selectedValues
    : [selectedValues];

  try {
    // Step 1: Update VisitorGroup collection for specific card_ids
    await VisitorGroup.updateMany(
      { "group_members.card_id": { $in: cardIds } },
      {
        $set: {
          "group_members.$[elem].check_out_time": currentTime,
          "group_members.$[elem].status": "checked_out",
          "group_members.$[elem].exit_gate": selectedExit,
        },
      },
      {
        arrayFilters: [{ "elem.card_id": { $in: cardIds } }],
      }
    );

    // Step 2: Retrieve the _id of group_members based on card_ids
    const groupMembers = await VisitorGroup.aggregate([
      { $unwind: "$group_members" },
      { $match: { "group_members.card_id": { $in: cardIds } } },
      {
        $project: {
          _id: 0,
          "group_members._id": 1,
          "group_members.card_id": 1,
        },
      },
    ]);

    // Map card_id to group_member _id for easier access
    const cardIdToMemberIdMap = groupMembers.reduce((map, member) => {
      map[member.group_members.card_id] = member.group_members._id;
      return map;
    }, {});

    // Step 3: Update VisitorCard collection using group_member IDs
    for (const cardId of cardIds) {
      const memberId = cardIdToMemberIdMap[cardId];

      if (memberId) {
        const updateResult = await VisitorCard.updateOne(
          { card_id: cardId },
          {
            $set: {
              status: "available",
              assigned_to: null,
            },
            $push: {
              last_assigned: memberId,
            },
          }
        );

        console.log(`Update result for card_id ${cardId}:`, updateResult);
      } else {
        console.warn(`No member ID found for card_id ${cardId}`);
      }
    }

    // Step 4: Check if all group members of each session are checked_out
    const sessionsToUpdate = await VisitorGroup.aggregate([
      { $unwind: "$group_members" },
      {
        $group: {
          _id: "$session_id",
          totalCount: { $sum: 1 },
          checkedOutCount: {
            $sum: {
              $cond: [{ $eq: ["$group_members.status", "checked_out"] }, 1, 0],
            },
          },
          checkedInCount: {
            $sum: {
              $cond: [{ $eq: ["$group_members.status", "checked_in"] }, 1, 0],
            },
          },
        },
      },
      {
        $match: {
          checkedInCount: 0, // Ensure no "checked_in" members
        },
      },
      { $project: { _id: 1 } },
    ]);

    // Step 5: Update VisitorSession collection if all group members are "checked_out"
    for (const sessionId of sessionsToUpdate.map((session) => session._id)) {
      const groupMembersStatus = await VisitorGroup.aggregate([
        { $match: { session_id: sessionId } },
        { $unwind: "$group_members" },
        {
          $group: {
            _id: "$session_id",
            allCheckedOut: {
              $min: { $eq: ["$group_members.status", "checked_out"] },
            },
          },
        },
      ]);

      const isAllCheckedOut = groupMembersStatus[0]?.allCheckedOut;

      await VisitorSession.updateOne(
        { _id: sessionId },
        {
          $set: {
            exit_gate: isAllCheckedOut ? selectedExit : null,
            check_out_time: isAllCheckedOut ? currentTime : null,
          },
        }
      );
    }

    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    console.error("Error during checkout process:", error);
    res.status(500).json({ message: "Error during checkout process", error });
  }
});

router.get("/download-report", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await VisitorSession.aggregate([
      {
        $match: {
          check_in_time: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "visitors",
          localField: "visitor_id",
          foreignField: "_id",
          as: "visitor_info",
        },
      },
      {
        $unwind: "$visitor_info",
      },
      {
        $lookup: {
          from: "visitor_groups",
          localField: "group_id",
          foreignField: "_id",
          as: "group_info",
        },
      },
      {
        $unwind: "$group_info",
      },
      {
        $project: {
          name: "$visitor_info.name",
          phone_number: "$visitor_info.phone_number",
          purpose_of_visit: 1,
          entry_gate: 1,
          check_in_time: 1,
          exit_gate: 1,
          check_out_time: 1,
          group_size: 1,
          "group_info.group_members.card_id": 1,
        },
      },
    ]);

    // Generate the Excel file
    const filePath = await generateExcel(result);

    // Send the generated Excel file to the client
    res.download(filePath, "Visitor_Report.xlsx", (err) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error during file download", error: err });
      } else {
        // Optionally delete the file after download
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error during download", error });
  }
});

router.post("/register-guest", async (req, res) => {
  const GuestInfo = req.body;

  console.log("Guest:", GuestInfo);

  // step 1: Generate a unique Id for the guest

  //step 2: save the guest in database

  // step 3: generate an automated email for the guest

  //step 4: resend the email for Hod

  res.status(200).json({
    message: "Guest registered successfully",
    receivedData: GuestInfo,
  });
});

module.exports = router;
