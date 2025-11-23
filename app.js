require('dotenv').config();
const express = require('express');
const app = express();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

app.use('/', indexRoutes);
app.use('/api', apiRoutes(pool));

// ←←←←← NO app.listen() AT ALL ←←←←←
module.exports = app;   // THIS LINE IS MANDATORY FOR VERCEL