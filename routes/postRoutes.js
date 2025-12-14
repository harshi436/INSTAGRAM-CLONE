const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary");
const { authenticate } = require("../middleware/authMiddleware");
const { createPost } = require("../controllers/postController");
const {
  likePost,
  unlikePost
} = require("../controllers/postController");
const { addComment,getFeed } = require("../controllers/postController");


router.post(
  "/create",
  authenticate,           // must be logged in
  upload.single("image"), // image upload
  createPost
);
router.put("/:postId/like", authenticate, likePost);
router.put("/:postId/unlike", authenticate, unlikePost);
router.post("/:postId/comment", authenticate, addComment);
router.get("/feed", authenticate, getFeed);

module.exports = router;
