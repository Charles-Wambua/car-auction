const placeBid = async ({ auction_id, user_id, bid_amount }) => {
    const { rows } = await pool.query(
        `INSERT INTO bids (auction_id, user_id, bid_amount)
         VALUES ($1, $2, $3) RETURNING *`,
        [auction_id, user_id, bid_amount]
    );
    return rows[0];
};

module.exports = { placeBid };
