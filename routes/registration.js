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
        const savedDoc = await newEntry.save();

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: savedDoc.email,
            subject: 'Event Registration Successful',
            text: `You have successfully registered!\nYour Registration ID is: ${savedDoc._id}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
        });
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router;