const { placeBid } = require('../models/bidModel');

exports.placeBid = async (req, res) => {
    try {
        const bid = await placeBid(req.body);
        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ error: 'Failed to place bid' });
    }
};
