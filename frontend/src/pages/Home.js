import React, { useState } from 'react';
import AuctionList from '../components/AuctionList';
import AuctionStatus from '../components/AuctionList';
import BidForm from '../components/AuctionList';
import NotificationModal from '../components/AuctionList';

const Home = () => {
  const [auctions, setAuctions] = useState([
    { id: 1, title: 'Antique Vase', basePrice: 100, status: 'Open' },
    { id: 2, title: 'Rare Painting', basePrice: 500, status: 'Closed' },
  ]);
  
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [notification, setNotification] = useState('');

  const handleSelectAuction = (id) => {
    const auction = auctions.find((a) => a.id === id);
    setSelectedAuction(auction);
  };

  const handleBidSubmit = (amount) => {
    if (selectedAuction) {
      setNotification(`Your bid of $${amount} has been placed on ${selectedAuction.title}`);
    }
  };

  return (
    <div style={styles.container}>
      <AuctionList auctions={auctions} onItemClick={handleSelectAuction} />
      {selectedAuction && (
        <>
          <AuctionStatus status={selectedAuction.status} />
          <BidForm onSubmit={handleBidSubmit} />
        </>
      )}
      {notification && (
        <NotificationModal message={notification} onClose={() => setNotification('')} />
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  heading: { textAlign: 'center', color: '#333' },
};

export default Home;





