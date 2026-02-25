const express = require('express');
const router = express.Router();
const axios = require('axios');
const Registration = require('../models/Registration');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'IoSC-EDC';
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'iosc.edc@gmail.com';

async function sendBrevoEmail(toEmail) {
    const subject = 'Confirmation of Registration - AI Simplified';
    const textContent = `Dear Participant,

Thank you for registering for our upcoming online workshop: AI Simplified. We are pleased to confirm your participation and are excited to have you join us.

The workshop will take place on 28th FEBRUARY 2026 at 5PM. The session will be streamed live on the official YouTube channel AI with Hassan (https://www.youtube.com/@AI.with.Hassan), ensuring easy access and a seamless viewing experience for all participants. The streaming link and any additional joining details will be shared with you prior to the event.

We have curated an engaging and insightful session, and we look forward to your active participation. Should you have any questions in the meantime, please feel free to reach out.

Thank you once again for your interest. We look forward to connecting with you at the workshop.

Best regards,
Team IoSC`;

    return axios.post(
        BREVO_API_URL,
        {
            sender: {
                name: BREVO_SENDER_NAME,
                email: BREVO_SENDER_EMAIL
            },
            to: [{ email: toEmail }],
            subject,
            textContent
        },
        {
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.API_KEY
            }
        }
    );
}

// POST /register
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        if (!data?.email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!process.env.API_KEY) {
            return res.status(500).json({ error: 'Brevo API key is missing in API_KEY' });
        }

        if (!process.env.MONGO_URI) {
            return res.status(500).json({ error: 'MongoDB URI is missing in MONGO_URI' });
        }

        const existingUser = await Registration.findOne({ email: data.email });
        let isNewUser = false;

        if (!existingUser) {
            const newEntry = new Registration(data);
            await newEntry.save();
            isNewUser = true;
        }

        let emailSent = true;
        try {
            await sendBrevoEmail(data.email);
        } catch (emailError) {
            emailSent = false;
            const brevoErr = emailError?.response?.data || emailError.message;
            console.error('Brevo send failed:', brevoErr);
        }

        return res.status(isNewUser ? 201 : 200).json({
            message: isNewUser
                ? (emailSent ? 'Registration successful, email sent' : 'Registration successful, email failed')
                : (emailSent ? 'User already exists, email sent' : 'User already exists, email failed'),
            emailSent,
            isNewUser
        });
    } catch (error) {
        const apiError = error?.response?.data || error.message;
        console.error('Registration/Brevo error:', apiError);
        return res.status(500).json({
            error: 'Registration failed or email send failed',
            details: apiError
        });
    }
});

/*
LEGACY CODE (commented intentionally)

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// const mailOptions = {
//     from: process.env.MAIL_USER,
//     to: savedDoc.email,
//     subject: 'Registration Confirmed - Dock-Up: Speaker Session & Orientation (IoSC)',
//     text: `Dear Participant, ...`
// };
// transporter.sendMail(mailOptions, (error) => {
//     if (error) console.error('Error sending email:', error);
// });
*/

module.exports = router;
