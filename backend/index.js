require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes')

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auction API is running!' });
});

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
