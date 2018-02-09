const express = require('express');     // web framework for node.
const mongoose = require('mongoose');   // Node Tool for MongoDB
const router = express.Router();    // Creates a new router object.
const config = require('./config/database');  // Mongoose Config 
const path = require('path');       // NodeJS Package for file paths
const authentication = require('./routes/authentication')(router);  // Import Authentication Routes 
const blogs = require('./routes/blogs')(router);    // Import Blog Routes
const bodyParser = require('body-parser');  // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const cors = require('cors');   // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const app = express();      // Initiate Express Application
const port = 3000;          // set port for server running

// Database Connectionn
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, { useMongoClient: true }, (err) => {
    // Check if database was able to connect
    if(err) {
        console.log('Could not connect to database: ', err);    // Return error message
    } else {
        console.log('Connected to database ' + config.db);  // Return success message
    }
});


// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));     // Allows cross origin in development only
app.use(bodyParser.urlencoded({ extended: false }))     // parse application/x-www-form-urlencoded
app.use(bodyParser.json())                              // parse application/json
app.use(express.static(__dirname + '/client/dist/'));   // Provide static directory for frontend
app.use('/authentication', authentication);             // Use Authentication routes in application
app.use('/blogs', blogs);                               // Use Blog routes in application

// Connect server to Angular2 index.html
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 3000
app.listen(port, () => {
    console.log('Server running on port ' + port);
});