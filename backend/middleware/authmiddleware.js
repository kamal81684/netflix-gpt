const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
	try {
		if (mongoose.connection.readyState !== 1) {
			return res.status(503).json({
				message: "Database is not connected. Check MongoDB Atlas network access.",
			});
		}

		const authHeader = req.header("Authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				message: "Access denied. No token provided.",
			});
		}

		const token = authHeader.split(" ")[1];

		if (!jwtSecret) {
			return res.status(500).json({
				message: "JWT_SECRET is not configured on the server.",
			});
		}

		const decoded = jwt.verify(token, jwtSecret);

		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(401).json({
				message: "Invalid token. User no longer exists.",
			});
		}

		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({
			message: "Invalid or expired token.",
		});
	}
};

module.exports = authMiddleware;
