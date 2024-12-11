// postController.js
const Post = require('../models/postModel');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, topics, message } = req.body;
    const newPost = new Post({
        title,
        topics,
        message,
        owner: req.user.userId,
        status: 'Live',
        timestamp: new Date(),
        expirationTime: new Date(Date.now() + 24*60*60*1000) // 24 hours from now
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Retrieve posts by topic
exports.getPostsByTopic = async (req, res) => {
    const { topic } = req.params;
    try {
        const posts = await Post.find({ topics: topic });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
};

// Interact with a post (like, dislike, comment)
exports.interactWithPost = async (req, res) => {
    const { id } = req.params;
    const { action, comment } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.status === 'Expired') {
            return res.status(403).json({ message: 'Cannot interact with expired post' });
        }
        if (action === 'like') {
            post.likes += 1;
        } else if (action === 'dislike') {
            post.dislikes += 1;
        } else if (action === 'comment') {
            post.comments.push({ user: req.user.userId, comment });
        }
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error interacting with post', error });
    }
};

// Retrieve the most active post in a topic
exports.getMostActivePost = async (req, res) => {
    const { topic } = req.params;
    try {
        const posts = await Post.find({ topics: topic }).sort({ likes: -1 }).limit(1);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving most active post', error });
    }
};

// Retrieve expired posts by topic
exports.getExpiredPosts = async (req, res) => {
    const { topic } = req.params;
    try {
        const posts = await Post.find({ topics: topic, status: 'Expired' });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving expired posts', error });
    }
};
