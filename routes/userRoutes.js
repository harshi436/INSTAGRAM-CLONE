const express = require("express");
const router = express.Router();

const {
  followUser,
  unfollowUser
} = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");

// Follow a user
router.put("/follow/:userId", authenticate, followUser);

// Unfollow a user
router.put("/unfollow/:userId", authenticate, unfollowUser);

module.exports = router;
