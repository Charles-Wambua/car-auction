const { Pool } = require('pg');
const pool = require('../config/db');

const createAuction = async ({ title, base_price, start_time, end_time }) => {
    const { rows } = await pool.query(
        `INSERT INTO auctions (title, base_price, start_time, end_time)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, base_price, start_time, end_time]
    );
    return rows[0];
};

module.exports = { createAuction };
