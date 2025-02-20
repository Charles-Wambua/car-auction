import React, { useState } from 'react';

const CreateAuction = ({ onCreateAuction }) => {
  const [form, setForm] = useState({ title: '', basePrice: '', startTime: '', endTime: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateAuction(form);
  };

  return (
    <div style={styles.container}>
      <h1>Create Auction</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} style={styles.input} required />
        <input type="number" name="basePrice" placeholder="Base Price" onChange={handleChange} style={styles.input} required />
        <input type="datetime-local" name="startTime" onChange={handleChange} style={styles.input} required />
        <input type="datetime-local" name="endTime" onChange={handleChange} style={styles.input} required />
        <button type="submit" style={styles.button}>Create</button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '400px', margin: '0 auto' },
  input: { display: 'block', marginBottom: '10px', padding: '8px', width: '100%' },
  button: { padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }
};

export default CreateAuction;