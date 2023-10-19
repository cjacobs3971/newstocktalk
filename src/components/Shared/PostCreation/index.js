import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {CATEGORIES} from '../CategoryFilter/index';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!, $category: String!) {
    createPost(title: $title, body: $body, category: $category) {
      id
      title
      body
      category
    }
  }
`;

function PostCreation() {
  const [title, setTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Core Stock Info');
  const [createPost] = useMutation(CREATE_POST);

  const isAuthenticated = !!localStorage.getItem('token'); // For simplicity, we're checking the token's existence.

  const handlePostCreation = async () => {
    try {
      await createPost({
        variables: {
          title: title,
          body: postContent,
          category: selectedCategory
        }
      });
      setTitle('');
      setPostContent('');
    } catch (err) {
      console.error("Error creating post:", err);
    }
  }

  if (!isAuthenticated) {
    return (
      <div>
        Please <a href="/login-register">login</a> to create a post.
      </div>
    );
  }

  return (
    <div className="post-creation-container">
      <input 
        type="text"
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="Title"
      />
      <textarea 
        value={postContent} 
        onChange={e => setPostContent(e.target.value)} 
        placeholder="Your content here..."
      />
      {/* Drop-down or buttons for category selection */}
      <select 
    value={selectedCategory}
    onChange={e => setSelectedCategory(e.target.value)}
>
    {CATEGORIES.map(category => (
        <option key={category} value={category}>
            {category}
        </option>
    ))}
</select>
      <button onClick={handlePostCreation}>Post</button>
    </div>
  );
}

export default PostCreation;
