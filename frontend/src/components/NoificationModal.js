import React from 'react';

const NotificationModal = ({ message, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>{message}</p>
        <button onClick={onClose} style={styles.button}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  button: {
    marginTop: '10px',
    padding: '8px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }
};

export default NotificationModal;