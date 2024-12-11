// postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Create post route (authentication required)
router.post('/posts', authMiddleware, postController.createPost);

// Get posts by topic
router.get('/posts/:topic', postController.getPostsByTopic);

// Interact with a post (like, dislike, comment)
router.post('/posts/:id/interact', authMiddleware, postController.interactWithPost);

// Get most active post by topic
router.get('/posts/:topic/active', postController.getMostActivePost);

// Get expired posts by topic
router.get('/posts/:topic/expired', postController.getExpiredPosts);

module.exports = router;
