const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "cc822a4e384d8612197d3d387ed97f50";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Serve static HTML files (ensure index.html, homepage.html, etc. exist in the project directory)
app.use(express.static(path.join(__dirname, 'public')));

// Weather API endpoint
app.get("/get-weather", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                q: city,
                appid: WEATHER_API_KEY,
                units: "metric", // temperature in Celsius
            },
        });

        const weatherData = response.data;
        res.json({
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Unable to fetch weather data" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
