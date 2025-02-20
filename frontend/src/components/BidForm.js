import React, { useState } from 'react';

const BidForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter your bid"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Place Bid</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
  },
  input: {
    padding: '8px',
  },
  button: {
    padding: '8px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }
};

export default BidForm;
