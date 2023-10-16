const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');  // Import this for better error handling

const SECRET_KEY = process.env.SECRET_KEY || 'your_very_secret_key';

const checkAuth = (context) => {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in to perform this action');
  }
};

const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().populate('author');
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserPosts(_, { userId }) {
      try {
        const posts = await Post.find({ author: userId }).populate('author');
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async register(_, { username, email, password }) {
        const user = await User.findOne({ username });
        if (user) {
          throw new Error('Username is taken');
        }
  
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
  
        const res = await newUser.save();
  
        const token = jwt.sign({
          id: res.id,
          username: res.username,
          email: res.email
        }, SECRET_KEY, { expiresIn: '1h' });
  
        return {
          ...res._doc,
          id: res._id,
          token
        };
      },
      async login(_, { username, password }) {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
  
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          throw new Error('Wrong credentials');
        }
  
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          email: user.email
        }, SECRET_KEY, { expiresIn: '1h' });
  
        return {
          ...user._doc,
          id: user._id,
          token
        };
      },
      async createPost(_, { title, body, category }, context) {
        checkAuth(context);  // Verify if the user is authenticated
  
        const newPost = new Post({
          title,
          body,
          category,
          author: context.user.id,
        });
  
        const post = await newPost.save();
        return post;
      },
      async deletePost(_, { postId }, context) {
        checkAuth(context);  // Verify if the user is authenticated
  
        try {
          const post = await Post.findById(postId);
          if (!post) {
            throw new Error('Post not found');
          }
          if (post.author.toString() !== context.user.id) {
            throw new AuthenticationError('Action not allowed');
          }
          await post.delete();
          return 'Post deleted successfully';
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  };
  
  module.exports = resolvers;

