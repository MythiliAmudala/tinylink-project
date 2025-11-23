const express = require('express');
const router = express.Router();
const validator = require('validator');
const { nanoid } = require('nanoid');

module.exports = (pool) => {
  // List all links
  router.get('/links', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch links' });
    }
  });

  // Create link
  router.post('/links', async (req, res) => {
    let { target_url, custom_code } = req.body;
    if (!validator.isURL(target_url)) return res.status(400).json({ error: 'Invalid URL' });

    const code = custom_code || nanoid(6);  // Generate 6-8 chars if not provided
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) return res.status(400).json({ error: 'Invalid code format' });

    try {
      await pool.query(
        'INSERT INTO links (short_code, target_url) VALUES ($1, $2)',
        [code, target_url]
      );
      res.status(201).json({ short_code: code, target_url });
    } catch (err) {
      if (err.code === '23505') {  // Unique violation
        return res.status(409).json({ error: 'Code already exists' });
      }
      res.status(500).json({ error: 'Failed to create link' });
    }
  });

  // Get stats for one code
  router.get('/links/:code', async (req, res) => {
    const { code } = req.params;
    try {
      const result = await pool.query('SELECT * FROM links WHERE short_code = $1', [code]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not Found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Error' });
    }
  });

  // Delete link
  router.delete('/links/:code', async (req, res) => {
    const { code } = req.params;
    try {
      const result = await pool.query('DELETE FROM links WHERE short_code = $1 RETURNING *', [code]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not Found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete' });
    }
  });

  return router;
};