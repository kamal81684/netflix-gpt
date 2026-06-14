const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

exports.signup = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: "Database is not connected. Check MongoDB Atlas network access.",
            });
        }

        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const safeUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        res.status(201).json(safeUser);

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.login = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: "Database is not connected. Check MongoDB Atlas network access.",
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            jwtSecret,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getMe = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: "Database is not connected. Check MongoDB Atlas network access.",
            });
        }

        return res.json({
            user: req.user,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch authenticated user.",
        });
    }
};