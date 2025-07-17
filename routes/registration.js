const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// POST /register
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const newEntry = new Registration(data);
        await newEntry.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

module.exports = router;