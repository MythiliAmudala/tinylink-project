const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
      res.render("dashboard", {
        links: result.rows,
        success: null,
        error: null,
        BASE_URL: process.env.BASE_URL
      });
    } catch (err) {
      res.render("dashboard", {
        links: [],
        success: null,
        error: err.message,
        BASE_URL: process.env.BASE_URL
      });
    }
  });

  router.get('/:code', async (req, res) => {
    const { code } = req.params;
    try {
      const result = await pool.query(
        "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE short_code = $1 RETURNING target_url",
        [code]
      );
      if (result.rows.length === 0) return res.status(404).send("Not found");
      res.redirect(result.rows[0].target_url);
    } catch (err) {
      res.status(500).send("Error");
    }
  });

  return router;
};
