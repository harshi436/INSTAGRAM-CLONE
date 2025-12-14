const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  try {
    //  Get token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    //  Verify token using secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Find user from DB using decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid token: user not found"
      });
    }

    //  Attach user to request object
    req.user = user;

    //  Move to next middleware/controller
    next();

  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
};
