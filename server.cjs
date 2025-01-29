const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = 4000;
const createRoutes = require('./routes.cjs'); // Import the routes

// Middleware
app.use(express.json());
app.use(cors());

// Connection
const MONGOURI =
  'mongodb+srv://alisina:alisina123!@intfind.9hoqy.mongodb.net/?retryWrites=true&w=majority&appName=intfind';
let db;
MongoClient.connect(MONGOURI)
  .then((client) => {
    db = client.db('typescript');
    console.log('Connected to Database');

    // Use the routes
    const routes = createRoutes(db);
    app.use('/', routes);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
