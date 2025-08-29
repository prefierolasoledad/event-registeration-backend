const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, // your Gmail address
        pass: process.env.MAIL_PASS  // your Gmail App Password
    }
});

// POST /register
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const newEntry = new Registration(data);
        
        
//         const savedDoc = await newEntry.save();

//         const mailOptions = {
//             from: process.env.MAIL_USER,
//             to: savedDoc.email,
//             subject: '  Registration Confirmed – Dock-Up: Speaker Session & Orientation (IoSC)',
//             text: `Dear Participant,

// Thank you for registering! 🎉
// Your spot is confirmed for Dock-Up, the Speaker Session & Orientation organized by the IoSC.

// Event Details:
// 📅 Date: 28th August
// 🕛 Time: 3–5 PM
// 📍 Venue: To be announced

// This exclusive session will introduce you to our club’s vision, structure, and upcoming initiatives. You’ll also hear from a renowned industry expert, who will share valuable insights and experiences to spark inspiration and innovation.

// Get ready to learn, connect, and be part of an exciting journey with IoSC.

// See you there!

// Best regards,
// Team IoSC`,
//             html: `
//                 <p>Dear Participant,</p>
//                 <p>Thank you for registering! 🎉<br>
//                 Your spot is confirmed for <b>Dock-Up</b>, the Speaker Session & Orientation organized by the  <b>IoSC</b>.</p>
//                 <h3>Event Details:</h3>
//                 <ul>
//                     <li>📅 Date: <b>28th August</b></li>
//                     <li>🕛 Time: <b>3–5 PM</b></li>
//                     <li>📍 Venue: <b>To be announced</b></li>
//                 </ul>
//                 <p>This exclusive session will introduce you to our club’s vision, structure, and upcoming initiatives. You’ll also hear from a renowned industry expert, who will share valuable insights and experiences to spark inspiration and innovation.</p>
//                 <p>Get ready to learn, connect, and be part of an exciting journey with IoSC.</p>
//                 <p>See you there!</p>
//                 <p>Best regards,<br>Team IoSC</p>
//             `
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending email:', error);
//             }
//         });
//         res.status(201).json({ message: 'Registration successful' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router;
