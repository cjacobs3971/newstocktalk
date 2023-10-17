import React, { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import Post from '../../components/Shared/Post';
import CategoryFilter from '../../components/Shared/CategoryFilter';
import PostCreation from '../../components/Shared/PostCreation';
import './style.css';

const GET_POSTS = gql`
  query {
    getPosts {
      id
      title
      body
      category
      createdAt
      author {
        username
      }
    }
  }
`;

const NEW_POST_SUBSCRIPTION = gql`
  subscription {
    newPost {
      id
      title
      body
      category
      createdAt
      author {
        username
      }
    }
  }
`;

function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { loading, error, data } = useQuery(GET_POSTS, {
    pollInterval: 3000,
  });
  const { data: subscriptionData } = useSubscription(NEW_POST_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData && data && data.getPosts) {
      data.getPosts.unshift(subscriptionData.newPost);
    }
  }, [subscriptionData, data]);

  let filteredPosts = [];
  if (data && data.getPosts) {
    filteredPosts = selectedCategory
      ? data.getPosts.filter(post => post.category === selectedCategory)
      : data.getPosts;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login-register';
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <PostCreation />
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="posts-section">
      {[...filteredPosts].reverse().map(post => (
    <Post key={post.id} post={post} />
    ))}
</div>
      <div className="logoutsection">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default DashboardPage;

