const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

async function startApolloServer() {
  // Start the Apollo Server
  await server.start();

  // Apply Apollo Server middleware to Express app
  server.applyMiddleware({ app });

  // Define a route to handle the root URL
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  // Start the server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log(`Apollo Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApolloServer();