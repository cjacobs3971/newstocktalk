import React from 'react';

function Post({ post }) {
  return (
    <div className="post-container">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>Category: {post.category}</p>
      <p>Posted by: {post.author.username}</p>
      <p>Date: {new Date(parseInt(post.createdAt)).toLocaleString()}</p>
    </div>
  );
}

export default Post;
