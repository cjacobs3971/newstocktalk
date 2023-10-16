const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    token: String!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    category: String!
    createdAt: String!
    author: User!
  }

  type Query {
    getPosts: [Post]
    getUserPosts(userId: ID!): [Post]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    login(username: String!, password: String!): User!
    createPost(title: String!, body: String!, category: String!): Post!
    deletePost(postId: ID!): String!
  }
`;

module.exports = typeDefs;

