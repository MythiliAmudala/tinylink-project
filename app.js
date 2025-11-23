require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Database connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false   // This is the key line for Neon
  }
});

// Middleware
app.use(express.json());  // For parsing JSON bodies
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.static('public'));  // Serve static files
app.set('view engine', 'ejs');  // Use EJS

// Routes
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
app.use('/', indexRoutes);
app.use('/api', apiRoutes(pool));  // Pass pool to API routes

// Error handling (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});