require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
require('./services/whatsAppClient'); // This ensures WhatsApp client starts automatically

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
      'http://34.78.213.218', 
      'http://10.132.0.4', 
      'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
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
