const express = require('express');
const pool = require('../config/db'); // PostgreSQL connection
const router = express.Router();

router.post('/bids', async (req, res) => {
    try {
        console.log("bids", req.body)
        const { listing_id, amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid bid amount' });
        }

        const listingQuery = 'SELECT base_price, start_time, end_time FROM listings WHERE id = $1';
        const listingResult = await pool.query(listingQuery, [listing_id]);

        if (listingResult.rows.length === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const { base_price, start_time, end_time } = listingResult.rows[0];
        const now = new Date();

        if (now < new Date(start_time) || now > new Date(end_time)) {
            return res.status(400).json({ message: 'Bidding is closed for this listing' });
        }

        const bidQuery = 'INSERT INTO bids (listing_id, amount) VALUES ($1, $2) RETURNING *';
        const bidResult = await pool.query(bidQuery, [listing_id, amount]);

        return res.status(201).json({
            message: amount < base_price ? 'Bid placed, but below base price!' : 'Bid placed successfully!',
            bid: bidResult.rows[0]
        });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// ✅ GET ALL BIDS (GET /api/bids)
router.get('/bidsget', async (req, res) => {
    try {
        const bidsQuery = `
            SELECT b.id, b.amount, b.created_at, l.title AS listing_title
            FROM bids b
            JOIN listings l ON b.listing_id = l.id
            ORDER BY b.created_at DESC
        `;
        const result = await pool.query(bidsQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// router.get('/bidsget/:id', async (req, res) => {
//     try {
//         res.setHeader('Cache-Control', 'no-store'); // Prevents caching

//         const id = req.params.id; // UUID as string
//         console.log("Fetching bids for listing ID:", id);

//         // Validate UUID format
//         const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
//         if (!uuidRegex.test(id)) {
//             return res.status(400).json({ message: 'Invalid UUID format' });
//         }

//         // Query to fetch bids
//         const bidsQuery = `
//             SELECT b.id, b.amount, b.created_at, l.title AS listing_title
//             FROM bids b
//             JOIN listings l ON b.listing_id = l.id
//             WHERE b.listing_id = $1
//             ORDER BY b.created_at DESC
//         `;

//         const result = await pool.query(bidsQuery, [id]);

//         // If the bids table is empty or no bids exist for the listing
//         if (result.rowCount === 0) {
//             return res.status(200).json([]); // Return an empty array instead of an error
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching bids:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });




module.exports = router;
