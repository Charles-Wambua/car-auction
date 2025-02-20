const express = require('express');
const pool = require('../config/db'); 
const router = express.Router();

router.post("/bids", async (req, res) => {
    console.log("reddddd", req.body);
    try {
        const { listing_id, bidder, amount } = req.body;

        if (!listing_id || !bidder || !amount || parseFloat(amount) <= 0) {
            return res.status(400).json({ message: "Invalid bid data provided" });
        }

        // Fetch listing details
        const listingQuery = await pool.query(
            "SELECT * FROM listings WHERE id = $1",
            [listing_id]
        );

        if (listingQuery.rows.length === 0) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const listing = listingQuery.rows[0];
        const { auction_id, base_price } = listing;

        // Check the highest current bid for this listing
        const highestBidQuery = await pool.query(
            "SELECT MAX(amount) AS highest_bid FROM bids WHERE listing_id = $1",
            [listing_id]
        );
        const highestBid = highestBidQuery.rows[0]?.highest_bid || 0;

        // ✅ Define is_below_base_price before using it
        const is_below_base_price = parseFloat(amount) < parseFloat(base_price);

        // ✅ Insert the bid (bidder as TEXT, user_id NULL since no UUID is given)
        await pool.query(
            `INSERT INTO bids (auction_id, listing_id, user_id, amount, is_below_base_price, bidder) 
             VALUES ($1, $2, NULL, $3, $4, $5)`,
            [auction_id, listing_id, parseFloat(amount), is_below_base_price, bidder]
        );

        // If the new bid is the highest, update the "Current Best Offer" (only if best_offer column exists)
        if (parseFloat(amount) > highestBid) {
            await pool.query(
                `UPDATE listings SET best_offer = $1, best_bidder = $2 WHERE id = $3`,
                [parseFloat(amount), bidder, listing_id]
            );
        }

        return res.status(201).json({
            message: "Bid placed successfully",
            is_below_base_price,
        });
    } catch (error) {
        console.error("Error placing bid:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

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

router.get("/best", async (req, res) => {
    try {
        const bestBidsQuery = await pool.query(`
            SELECT b.listing_id, b.bidder, b.amount, b.created_at
            FROM bids b
            WHERE b.amount = (
                SELECT MAX(amount) 
                FROM bids 
                WHERE listing_id = b.listing_id
            )
            ORDER BY b.listing_id;
        `);

        return res.status(200).json(bestBidsQuery.rows);
    } catch (error) {
        console.error("Error fetching best bids:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.delete("/reset", async (req, res) => {
    try {
        await pool.query("DELETE FROM bids");
        return res.status(200).json({ message: "All bids have been reset." });
    } catch (error) {
        console.error("Error resetting bids:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/best/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const bestBidQuery = await pool.query(
            `
            SELECT b.listing_id, b.bidder, b.amount, b.created_at
            FROM bids b
            WHERE b.listing_id = $1
            AND b.amount = (
                SELECT MAX(amount) 
                FROM bids 
                WHERE listing_id = $1
            )
            LIMIT 1;
            `,
            [id] 
        );

        if (bestBidQuery.rows.length === 0) {
            return res.status(404).json({ message: "No bids found for this auction" });
        }

        return res.status(200).json(bestBidQuery.rows[0]);
    } catch (error) {
        console.error("Error fetching best bid:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
