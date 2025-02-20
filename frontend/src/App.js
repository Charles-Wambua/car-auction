// App.js
import React from 'react';
import Home from './pages/Home';

function App() {
  return (
    <div >
    {/* //  <h1 style={styles.title}>Digital Trading Platform</h1> */}
      <Home />
    </div>
  );
}

const styles = {
  appContainer: { textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { color: '#222' },
};

export default App;
