// routes/auth.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const UsersModel = require("../models/users.js");
const Visitor = require("../models/visitors.js");
const VisitorSession = require("../models/visitor_sessions.js");
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const VisitorModel = require("../models/visitors.js");
const fs = require("fs");
const path = require("path");
const { ObjectId } = mongoose.Types;

// Function to convert image to base64
const imageToBase64 = (imagePath) => {
  const bitmap = fs.readFileSync(imagePath);
  return `data:image/png;base64,${Buffer.from(bitmap).toString("base64")}`;
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "load_dummy_database") {
    try {
      // Load image and convert to base64
      const fullImagePath = path.join(
        __dirname,
        "../assets",
        "Passport_photo.png"
      ); // Update with your actual image path
      const base64Image = imageToBase64(fullImagePath);

      // Insert visitor cards
      const cardDocuments = [];
      for (let i = 1; i <= 500; i++) {
        const formattedCardId = String(i).padStart(3, "0");
        cardDocuments.push({
          card_id: formattedCardId,
          status: "available",
          assigned_to: null,
          last_assigned: [],
        });
      }
      await VisitorCard.insertMany(cardDocuments);

      // Insert a user document
      await UsersModel.create({
        username: "john",
        password: "1234",
        role: "admin",
      });

      // Update existing card documents starting from card_id 103
      for (let i = 103; i <= 500; i++) {
        const formattedCardId = String(i).padStart(3, "0");
        await VisitorCard.updateOne(
          { card_id: formattedCardId },
          {
            $set: { status: "available", assigned_to: null, last_assigned: [] },
          }
        );
      }

      let cardId = 103;
      // Insert 9 more visitors with varying group sizes
      for (let i = 1; i <= 9; i++) {
        const groupSize = 1 + (i % 5);

        // Insert visitor
        const visitorDoc = await Visitor.create({
          name: `Visitor ${i}`,
          phone_number: `123456780${i}`,
        });

        // Insert group
        const groupDoc = await VisitorGroup.create({
          session_id: new ObjectId(),
          group_members: [],
        });

        // Insert session
        const sessionDoc = await VisitorSession.create({
          visitor_id: visitorDoc._id,
          purpose_of_visit: `Purpose ${i}`,
          entry_gate: `Gate ${i % 2 === 0 ? "1" : "2"}`,
          check_in_time: new Date(),
          exit_gate: `Gate ${i % 2 === 0 ? "1" : "2"}`,
          check_out_time: i % 2 === 0 ? new Date() : null,
          group_size: groupSize,
          group_id: groupDoc._id,
          photos: base64Image,
        });

        // Update session_id in visitor_groups
        groupDoc.session_id = sessionDoc._id;
        await groupDoc.save();

        // Insert group members
        const groupMembers = [];
        for (let j = 0; j < groupSize; j++) {
          const groupMember = {
            card_id: String(cardId).padStart(3, "0"),
            check_in_time: new Date(),
            exit_gate: j % 2 === 0 ? (i % 2 === 0 ? "Gate 1" : "Gate 2") : null,
            check_out_time: j % 2 === 0 ? new Date() : null,
            status: j % 2 === 0 ? "checked_out" : "checked_in",
          };
          groupMembers.push(groupMember);

          const lastAssignedArray = [];
          if (j % 2 === 0) {
            lastAssignedArray.push(groupMember._id);
          }

          // Update card status
          await VisitorCard.updateOne(
            { card_id: String(cardId).padStart(3, "0") },
            {
              $set: {
                status: j % 2 === 0 ? "available" : "assigned",
                assigned_to: j % 2 === 0 ? null : groupMember._id,
                last_assigned: lastAssignedArray,
              },
            }
          );

          cardId++;
        }

        // Update group members in visitor_groups
        groupDoc.group_members = groupMembers;
        await groupDoc.save();
      }

      // Integrate visitor_sessions update logic
      await updateVisitorSessions();

      res.json("Dummy database loaded successfully");
    } catch (error) {
      console.error("Error loading dummy database:", error);
      res.status(500).json("Internal server error");
    }
    return;
  }

  UsersModel.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.json("No record existed");
      }
      if (password === user.password) {
        req.session.user = {
          username: user.username,
          role: user.role,
        };
        res.json("Success");
      } else {
        res.json("The password is incorrect");
      }
    })
    .catch((err) => {
      console.error("User lookup error:", err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  UsersModel.create({ username, password, role })
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).json(err));
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

module.exports = router;