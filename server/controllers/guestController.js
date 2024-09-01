const GuestModel = require("../pre_approval_models/Guest");
const transporter = require("../config/mailer");
const generateUnique10DigitUUID = require("../utils/uniqueIdGenerator");
const formatDateTime = require("../utils/dateUtils"); // Import your date formatting 
const nodemailer = require("nodemailer");
const getEmailTemplate = require("../utils/emailTemplateService");
const { validationResult } = require('express-validator');


const sendInvitation = async (req, res) => {
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, mobile, event, invitedAs, eventDateTime } = req.body;

  // Generate a unique passId
  const existingId = await GuestModel.find().distinct("passId");
  const passId = generateUnique10DigitUUID(existingId);

  try {
    const newGuest = new GuestModel({
      passId,
      name,
      email,
      subject,
      mobile,
      event,
      invitedAs,
      eventDateTime,
    });
    const template = await getEmailTemplate();
    let emailTemplate = template.template;
    if (!emailTemplate) {
      return res.status(404).json({ message: "Email template not found" });
    }

    let emailHtml = emailTemplate
      .replace("${name}", name)
      .replace("${eventDateTime}", formatDateTime(eventDateTime)) // Use the formatDateTime function
      .replace("${passId}", passId);

    // Configure nodemailer with SMTP details from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Define the email options
    const mailOptions = {
      from: `"Vandana" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject || "You are Invited!",
      html: emailHtml, // Use the updated template with actual values
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    await newGuest.save();

    res.status(200).json({ message: "Invitation sent and history updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getGuestHistory = async (req, res) => {
  try {
    const guests = await GuestModel.find();
    console.log("Guest history served");
    res.status(200).json(guests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    // Get the current date and time
    const currentDate = new Date();
    console.log("Current date and time:", currentDate);
    // Find guests with eventDateTime in the future (upcoming events)
    const upcomingEvents = await GuestModel.find({
      eventDateTime: { $gte: currentDate },
    });
    console.log("Upcoming events served");
    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resendInvitation = async (req, res) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { passId } = req.params;

  try {
    // Fetch guest details from the database
    const guest = await GuestModel.findOne({ passId });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const template = await getEmailTemplate();
    let emailTemplate = template.template;
    if (!emailTemplate) {
      return res.status(404).json({ message: "Email template not found" });
    }

    let emailHtml = emailTemplate
      .replace("${name}", guest.name)
      .replace("${eventDateTime}", formatDateTime(guest.eventDateTime))
      .replace("${passId}", passId);

    // Prepare the email content
    const emailContent = {
      from: process.env.SMTP_USER,
      to: guest.email,
      subject: guest.subject,
      html: emailHtml,
    };

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Send the email
    await transporter.sendMail(emailContent);

    // Update the guest record to reflect the resent invitation
    guest.No_ofemail_sent = (guest.No_ofemail_sent || 0) + 1; // Initialize if undefined
    await guest.save();

    console.log("Invitation resent successfully");
    res.status(200).json({ message: "Invitation resent successfully" });
  } catch (error) {
    console.error("Error resending invitation:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




module.exports = {
  sendInvitation,
  getGuestHistory,
  getUpcomingEvents,
  resendInvitation,
};
