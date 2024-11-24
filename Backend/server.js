const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config(); // Import dotenv

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// // OpenAI Configuration
// const openai = new OpenAIApi(
//     new Configuration({
//         apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
//     })
// );

// API Endpoint
app.post("/api/email", async (req, res) => {
    const { email } = req.body;

    // Validate input
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address. Please provide a valid email.",
        });
    }

    // Prompt engineering for personalized message
    const prompt = `
  Create a professional LinkedIn connection request message. The recipient's email is "${email}". The tone should be warm, professional, and focused on potential collaboration. Include the following:
  - A brief introduction.
  - The reason for connecting (e.g., shared professional interests or expertise).
  - A friendly closing.
  Example:
  "Hi [Name], I came across your profile and was impressed by your work in [industry/domain]. I’d love to connect to explore opportunities for collaboration. Looking forward to staying in touch!"
  `;

    try {
        // const response = await openai.createCompletion({
        //     model: "gpt-4o-mini", // GPT-4o Mini model
        //     prompt,
        //     max_tokens: 100,
        //     temperature: 0.7,
        // });

        // const message = response.data.choices[0].text.trim();

        return res.status(200).json({
            success: true,
            email,
            // message,
        });
    } catch (error) {
        console.error("Error with OpenAI API:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error generating connection message.",
        });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
