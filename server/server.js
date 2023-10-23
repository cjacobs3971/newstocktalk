require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path'); // Add this to resolve paths
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/connection');
const jwtMiddleware = require('./middleware/authMiddleware');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
const cors = require('cors');
app.use(cors(corsOptions));

// Use the JWT middleware
app.use(jwtMiddleware);

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { user: req.user };
    },
  });

  await connectDB();
  await server.start();

  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('path'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../build', '../build/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();


