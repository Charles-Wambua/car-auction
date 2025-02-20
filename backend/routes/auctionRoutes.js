const express = require('express');
const { createAuction, getAuctions,getListings } = require('../controllers/auctionController');
const router = express.Router();
const pool = require('../config/db');

router.get('/', (req, res) => {
  console.log('🔍 GET /api/auctions hit!');
  getAuctions(req, res);
});
router.get('/listings',(req, res)=>{
    getListings(req,res)
} )

router.post('/auction-dates', async (req, res) => {
  try {
      const { auction_number, start_date, end_date, start_time, end_time } = req.body;

      if (!auction_number || !start_date || !end_date || !start_time || !end_time) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      const newAuction = await pool.query(
          `INSERT INTO auctions (auction_number, start_date, end_date, start_time, end_time)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [auction_number, start_date, end_date, start_time, end_time]
      );

      res.status(201).json({ message: 'Auction created successfully', auction: newAuction.rows[0] });

  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});

router.get('/auction-dates', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM auctions ORDER BY created_at DESC');
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Auction not found' });
      }

      res.status(200).json(result.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;