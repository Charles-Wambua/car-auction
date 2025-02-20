import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuctionItem = ({ item, onClick }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bestOffer, setBestOffer] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBestOffer();
  }, []);

  const fetchBestOffer = async () => {
    try {
      const response = await axios.get(`/bids/${item.id}`);
      if (response.data.length > 0) {
        setBestOffer(response.data[0]); // Highest bid is first
      }
    } catch (error) {
      console.error('Error fetching best offer:', error);
    }
  };

  const handleBid = async () => {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      setMessage('Please enter a valid bid amount.');
      return;
    }

    const bidValue = parseFloat(bidAmount);
    const now = new Date();
    const startTime = new Date(item.start_time);
    const endTime = new Date(item.end_time);

    if (now < startTime || now > endTime) {
      setMessage('Bidding is closed for this auction.');
      return;
    }

    try {
      const response = await axios.post('/bids', {
        auction_id: item.id,
        amount: bidValue,
      });

      if (response.status === 201) {
        setMessage(bidValue < item.base_price ? 'Bid placed, but below base price!' : 'Bid placed successfully!');
        fetchBestOffer(); // Refresh the best bid
      }
    } catch (error) {
      setMessage('Error placing bid. Try again.');
    }
  };

  return (
    <div style={styles.item} onClick={() => onClick(item.id)}>
      <img src={item.image_url || '/assets/placeholder.jpg'} alt={item.title} style={styles.image} />
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p><strong>Base Price:</strong> ${parseFloat(item.base_price).toLocaleString()}</p>
      <p><strong>Best Offer:</strong> {bestOffer ? `$${bestOffer.amount}` : 'No bids yet'}</p>
      <p><strong>Starts:</strong> {new Date(item.start_time).toLocaleDateString()}</p>
      <p><strong>Ends:</strong> {new Date(item.end_time).toLocaleDateString()}</p>

      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter your bid"
        style={styles.input}
      />
      <button onClick={handleBid} style={styles.button}>Place Bid</button>
      {message && <p style={{ color: bidAmount < item.base_price ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

const styles = {
  item: {
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
    background: '#fff',
    maxWidth: '300px'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px'
  },
  input: {
    width: '80%',
    padding: '8px',
    marginTop: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    marginTop: '10px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default AuctionItem;
