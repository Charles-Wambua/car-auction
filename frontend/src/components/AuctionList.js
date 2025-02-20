import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Modal, Button, DatePicker, TimePicker } from 'antd';
import AuctionModal from '../modals/auctionModal';
import CountdownTimer from './countDownTimer';

const AuctionList = () => {
  const [listings, setListings] = useState([]);
  const [bids, setBids] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bestBid, setBestBid] = useState('');
  const [filters, setFilters] = useState({ year: '' });
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [auctionDates, setAuctionDates] = useState({
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    fetchListings();
    fetchBestBid()
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auctions/listings', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      setListings(response.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };
  const fetchBestBid = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bids/best', {
        headers: { 'Cache-Control': 'no-cache' }
      });

      // Transform data into a lookup object: { listing_id: { amount, bidder, count } }
      const bidMap = response.data.reduce((acc, bid) => {
        acc[bid.listing_id] = {
          amount: parseFloat(bid.amount).toLocaleString(), // Format currency
          bidder: bid.bidder,
          count: bid.count || 1, // Ensure count exists
        };
        return acc;
      }, {});

      setBestBid(bidMap);
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setAuctionDates(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAuctionDates = async () => {
    const { startDate, endDate, startTime, endTime } = auctionDates;

    if (!startDate || !endDate || !startTime || !endTime) {
      message.error('Please fill in all date and time fields.');
      return;
    }

    const auctionData = {
      auction_number: `AUCTION-${Date.now()}`,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      start_time: startTime.format('HH:mm:ss'),
      end_time: endTime.format('HH:mm:ss'),
    };

    try {
      await axios.post('http://localhost:5000/api/auctions/auction-dates', auctionData);
      message.success('Auction dates set successfully!');
    } catch (error) {
      console.error('Error creating auction:', error);
      message.error(error.response?.data?.error || 'An error occurred while creating the auction.');
    }
  };

  const handleCardClick = (auction) => {
    setSelectedAuction(auction);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAuction(null);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, year: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ year: '' });
  };

  const toggleSort = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const filteredListings = listings
    .filter(item => (filters.year ? item.title.includes(filters.year) : true))
    .sort((a, b) => sortOrder === 'asc'
      ? parseFloat(a.base_price) - parseFloat(b.base_price)
      : parseFloat(b.base_price) - parseFloat(a.base_price)
    );

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Available Auctions</h2>
      <CountdownTimer onCountdownUpdate={setCountdown} />

      {/* Filters & Sorting Section */}
      <div style={styles.filters}>
        <label>Filter by Year:</label>
        <select value={filters.year} onChange={handleFilterChange} style={styles.select}>
          <option value="">All</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
        </select>
        <button onClick={clearFilters} style={styles.clearButton}>Clear Filters</button>
        <button onClick={toggleSort} style={styles.sortButton}>
          Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
        </button>

        {/* Auction Date Selection */}
        <div style={styles.datePickerContainer}>
          <DatePicker
            placeholder="Start Date"
            value={auctionDates.startDate}
            onChange={date => handleDateChange('startDate', date)}
          />
          <TimePicker
            placeholder="Start Time"
            format="HH:mm"
            value={auctionDates.startTime}
            onChange={time => handleDateChange('startTime', time)}
          />
          <DatePicker
            placeholder="End Date"
            value={auctionDates.endDate}
            onChange={date => handleDateChange('endDate', date)}
          />
          <TimePicker
            placeholder="End Time"
            format="HH:mm"
            value={auctionDates.endTime}
            onChange={time => handleDateChange('endTime', time)}
          />
          <Button type="primary" onClick={handleSubmitAuctionDates}>Submit</Button>
        </div>
      </div>

      {/* Listings Section */}
      <div style={styles.list}>
        {filteredListings.map(item => {
          const bestBidData = bestBid[item.id]; // Get best bid data for this listing

          return (
            <div key={item.id} style={styles.card} onClick={() => handleCardClick(item)}>
              <img src={item.image_url} alt={item.title} style={styles.image} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p><strong>Base Price:</strong> ${parseFloat(item.base_price).toLocaleString()}</p>
              <p>
                <strong>Best Offer:</strong>{' '}
                {bestBidData ? `$${bestBidData.amount} by ${bestBidData.bidder}` : 'No bids yet'}
              </p>
              <p>
                <strong>Total Bids:</strong> {bestBidData?.count || 0}
              </p>
              <p><strong>Countdown:</strong> {countdown}</p>
            </div>
          );
        })}
      </div>


      {/* Auction Modal */}
      <Modal
  title="Auction Details"
  open={isModalVisible}
  onCancel={handleModalClose}
  footer={null}
  centered
  width={Math.min(window.innerWidth * 0.9, 1200)}
  style={{ top: 20 }}
  bodyStyle={{
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    maxHeight: '80vh',
    overflowY: 'auto'
  }}
>
  {selectedAuction && <AuctionModal key={selectedAuction.id} auction={selectedAuction} />}
</Modal>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '20px' },
  filters: { display: 'flex', justifyContent: 'center', gap: '10px' },
  select: { padding: '5px' },
  clearButton: { padding: '5px', cursor: 'pointer', background: '#f44336', color: '#fff', border: 'none' },
  sortButton: { padding: '5px', cursor: 'pointer', background: '#2196F3', color: '#fff', border: 'none' },
  datePickerContainer: { display: 'flex', gap: '10px' },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { border: '1px solid #ddd', padding: '15px', borderRadius: '10px', cursor: 'pointer' },
  image: { width: '100%', borderRadius: '8px' }
};

export default AuctionList;
