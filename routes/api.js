const express = require('express');
const validator = require('validator');
const { nanoid } = require('nanoid');

module.exports = (pool) => {
  const router = express.Router();

  router.post('/links', async (req, res) => {
    let { target_url, custom_code } = req.body;

    if (!validator.isURL(target_url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const code = custom_code || nanoid(6);

    try {
      await pool.query(
        "INSERT INTO links (short_code, target_url) VALUES ($1, $2)",
        [code, target_url]
      );
      res.status(201).json({ short_code: code });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/links/:code', async (req, res) => {
    const { code } = req.params;
    try {
      await pool.query("DELETE FROM links WHERE short_code = $1", [code]);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Delete failed" });
    }
  });

  return router;
};
