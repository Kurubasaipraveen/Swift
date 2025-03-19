const express = require('express');
const axios = require('axios');
const { getDB } = require('./db');

const router = express.Router();

// Load data from external API and insert into DB
router.get('/load', async (req, res) => {
  try {
    const db = getDB();

    // Fetch Users
    const users = (await axios.get('https://jsonplaceholder.typicode.com/users')).data;

    for (const user of users) {
      await db.collection('users').updateOne(
        { id: user.id },
        { $set: user },
        { upsert: true }
      );
    }

    // Fetch and insert posts and comments
    const posts = (await axios.get('https://jsonplaceholder.typicode.com/posts')).data;
    const comments = (await axios.get('https://jsonplaceholder.typicode.com/comments')).data;

    for (const post of posts) {
      await db.collection('posts').updateOne(
        { id: post.id },
        { $set: post },
        { upsert: true }
      );
    }

    for (const comment of comments) {
      await db.collection('comments').updateOne(
        { id: comment.id },
        { $set: comment },
        { upsert: true }
      );
    }

    res.status(200).json({ message: 'Data loaded successfully' });
  } catch (error) {
    console.error('Error loading data:', error.message);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Delete all users
router.delete('/users', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('users').deleteMany({});
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting users:', error.message);
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

// Delete a user by ID
router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const db = getDB();
    const result = await db.collection('users').deleteOne({ id: parseInt(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user by ID (including posts and comments)
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const db = getDB();

    const user = await db.collection('users').findOne({ id: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await db.collection('posts').find({ userId: user.id }).toArray();
    const postIds = posts.map((post) => post.id);

    const comments = await db.collection('comments').find({ postId: { $in: postIds } }).toArray();
    const commentsByPostId = comments.reduce((acc, comment) => {
      acc[comment.postId] = acc[comment.postId] || [];
      acc[comment.postId].push(comment);
      return acc;
    }, {});

    for (const post of posts) {
      post.comments = commentsByPostId[post.id] || [];
    }

    user.posts = posts;

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Add a new user
router.put('/users', async (req, res) => {
  const user = req.body;

  if (!user || !user.id || !user.name || !user.email) {
    return res.status(400).json({ error: 'Invalid user data' });
  }

  try {
    const db = getDB();

    const existingUser = await db.collection('users').findOne({ id: user.id });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    await db.collection('users').insertOne(user);

    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

module.exports = router;
