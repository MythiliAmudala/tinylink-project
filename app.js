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

const indexRoutes = require('./routes/index')(pool);
const apiRoutes = require('./routes/api')(pool);

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// ------------------------------
// Local development ONLY
// ------------------------------
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Export for Vercel
module.exports = app;
