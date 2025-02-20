import React from 'react';

const AuctionStatus = ({ status }) => {
  return (
    <div style={styles.container}>
      <p>Status: {status}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px',
    backgroundColor: '#f4f4f4',
    margin: '10px 0',
  }
};

export default AuctionStatus;