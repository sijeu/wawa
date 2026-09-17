const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Register:", username);

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.json({
                success: false,
                message: "Username already exists"
            });
        }

        const newUser = new User({
            username,
            password
        });

        await newUser.save();

        res.json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Login:", username);

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid username or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
