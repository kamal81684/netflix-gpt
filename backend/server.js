const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("Missing MongoDB connection string. Set MONGODB_URL or MONGO_URI in backend/.env");
}

mongoose.connect(mongoUri)
.then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});

app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
    console.log(
        `Server running on ${port}`
    );
});