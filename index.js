const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.get('/', async (req, res) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        // Fetch geolocation data from IPinfo API
        const response = await axios.get(`https://ipinfo.io/${clientIP}/json?token=${process.env.IPINFO_TOKEN}`);
        const geoData = response.data;

        res.json({
            ip: clientIP,
            location: geoData,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching geolocation data", error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
