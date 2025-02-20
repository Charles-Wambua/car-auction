const pool = require('../config/db');

const getAuctions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM auctions ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getListings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAuctions, getListings };
