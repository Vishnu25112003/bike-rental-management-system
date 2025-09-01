// controllers/contactController.js
const Contact = require("../models/contactModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to DB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Contact Message",
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error in sending contact form message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

module.exports = { sendMessage };
