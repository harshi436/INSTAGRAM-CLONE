const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    // 1️⃣ Validate input
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!req.body.caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    // 2️⃣ Create post in DB
    const post = await Post.create({
      image: req.file.path,     // Cloudinary URL
      caption: req.body.caption,
      user: req.user._id        // authenticated user
    });

    res.status(201).json({
      message: "Post created successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already liked
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({
      message: "Post liked",
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has liked the post
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "You have not liked this post yet" });
    }

    // Remove the user's ID from likes array
    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await post.save();

    res.json({
      message: "Post unliked",
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();

    res.status(201).json({
      message: "Comment added",
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getFeed = async (req, res) => {
  try {
    // 1️⃣ Logged-in user's following list
    const followingUsers = req.user.following;

    // 2️⃣ Fetch posts of followed users
    const feedPosts = await Post.find({
      user: { $in: followingUsers }
    })
      .populate("user", "username email")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    // 3️⃣ Send feed
    res.status(200).json(feedPosts);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching feed",
      error: error.message
    });
  }
};