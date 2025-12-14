
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");



const app = express();





connectDB();


app.use(cors());                 // Allow cross-origin requests
app.use(express.json());         // Parse JSON request body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);


//  Test route (optional but good)
app.get("/", (req, res) => {
  res.send("Instagram Mini Clone API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
