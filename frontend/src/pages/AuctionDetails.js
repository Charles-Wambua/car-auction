import React from 'react';

const AuctionDetails = ({ auction, placeBid }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{auction.title}</h1>
      <p>Base Price: ${auction.basePrice}</p>
      <p>Status: {auction.status}</p>
      <button style={styles.button} onClick={placeBid}>Place Bid</button>
    </div>
  );
};

const styles = {
  container: { padding: '20px', border: '1px solid #ccc' },
  heading: { color: '#222' },
  button: { 
    padding: '10px 20px', 
    backgroundColor: '#007bff', 
    color: '#fff', 
    border: 'none', 
    cursor: 'pointer' 
  }
};

export default AuctionDetails;