
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Contact = require("./models/contact");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((error) => console.log("MongoDB Connection Error:", error));

// Gmail Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Home Route
app.get("/", (req, res) => {
    res.send("Tapaswini's Portfolio Backend is Running!");
});

// Contact Route
app.post("/contact", async (req, res) => {
    console.log("CONTACT ROUTE HIT!");
    try {
        const { name, email, message } = req.body;

        // Validate form fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        // Save contact message in MongoDB
        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        console.log("Contact message saved in MongoDB!");

        // Send email notification
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: `New Portfolio Message from ${name}`,
                text: `
You received a new message from your portfolio!

Name: ${name}
Email: ${email}

Message:
${message}
                `
            });

            console.log("Email sent successfully!");

            return res.status(201).json({
                success: true,
                message: "Your message was saved and emailed successfully!"
            });

        } catch (emailError) {
            console.log("Email Sending Error:", emailError);

            return res.status(201).json({
                success: true,
                message: "Your message was saved, but email notification failed."
            });
        }

    } catch (error) {
        console.log("Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
