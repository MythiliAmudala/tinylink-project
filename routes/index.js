const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Health check
router.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
      res.render('dashboard', { 
        links: result.rows, 
        error: null, 
        success: null,
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
      });
    } catch (err) {
      console.error('Database error:', err.message);  // This will show in your terminal!
      console.error(err.stack);
      res.render('dashboard', { 
        links: [], 
        error: 'Failed to load links: ' + err.message, 
        success: null,
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
      });
    }
  });

// Stats page
router.get('/code/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query('SELECT * FROM links WHERE short_code = $1', [code]);
    if (result.rows.length === 0) return res.status(404).send('Not Found');
    res.render('stats', { link: result.rows[0] });
  } catch (err) {
    res.status(500).send('Error');
  }
});

// Redirect
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP WHERE short_code = $1 RETURNING target_url',
      [code]
    );
    if (result.rows.length === 0) return res.status(404).send('Not Found');
    res.redirect(302, result.rows[0].target_url);
  } catch (err) {
    res.status(500).send('Error');
  }
});

module.exports = router;