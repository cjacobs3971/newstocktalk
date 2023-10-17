import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Post from '../../components/Shared/Post';
import CategoryFilter from '../../components/Shared/CategoryFilter';
import PostCreation from '../../components/Shared/PostCreation';  // Adjusted path
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

function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { loading, error, data } = useQuery(GET_POSTS);

  // Ensure data is loaded and data.getPosts is available
  let filteredPosts = [];
  if (data && data.getPosts) {
    filteredPosts = selectedCategory
      ? data.getPosts.filter(post => post.category === selectedCategory)
      : data.getPosts;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming you store the token in localStorage
    // Redirect user to login or home page, or force a re-render
    window.location.href = '/login-register'; // replace with your login page route
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <PostCreation />
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        
      </div>
      <div className="posts-section">
        {filteredPosts.map(post => (
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

