require("dotenv").config();  // for loading environment variables, if needed

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);
console.log("Server file is being executed...");

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

console.log("Initializing Express app...");

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "cc822a4e384d8612197d3d387ed97f50";  
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

console.log("Setting up routes...");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/homepage.html", (req, res) => {
    res.sendFile(path.join(__dirname, "homepage.html"));
});

app.get("/main.html", (req, res) => {
    res.sendFile(path.join(__dirname, "main.html"));
});

app.get("/get-weather", async (req, res) => {
    const city = req.query.city;

    if (!city || city.trim() === "") {
        return res.status(400).json({ error: "City is required and cannot be empty" });
    }

    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                q: city,
                appid: WEATHER_API_KEY,
                units: "metric",
            },
        });

        const weatherData = response.data;
        const temperature = weatherData.main.temp;
        const description = weatherData.weather[0].description;

        res.json({ temperature, description });
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Unable to fetch weather data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
