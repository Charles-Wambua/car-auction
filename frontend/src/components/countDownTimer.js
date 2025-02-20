import { useState, useEffect } from "react";
import axios from "axios";

const CountdownTimer = ({ onCountdownUpdate }) => {
  const [latestAuction, setLatestAuction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch latest auction
  const fetchAuctions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auctions/auction-dates");
      console.log("Fetched auctions:", res.data); // Debugging

      if (res.data.length > 0) {
        // Get the latest auction based on created_at timestamp
        const latest = res.data.reduce((latest, current) =>
          new Date(current.created_at) > new Date(latest.created_at) ? current : latest
        );

        console.log("Latest auction selected:", latest); // Debugging
        setLatestAuction(latest);
      } else {
        console.warn("No auctions found.");
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  // Calculate countdown time left
  useEffect(() => {
    if (!latestAuction) return;

    const updateCountdown = () => {
      const now = new Date();

      // Construct endDateTime correctly
      const endDateTime = new Date(latestAuction.end_date);
      const [hours, minutes, seconds] = latestAuction.end_time.split(":").map(Number);
      
      // Ensure the date is correctly set
      endDateTime.setHours(hours, minutes, seconds, 0);

      if (isNaN(endDateTime.getTime())) {
        console.error("Invalid endDateTime:", endDateTime);
        setTimeLeft("Invalid auction time");
        return;
      }

      const difference = endDateTime - now;

      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
      const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
    };

    updateCountdown(); // Call once immediately to avoid delay
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [latestAuction]);

  // Pass countdown to parent
  useEffect(() => {
    if (onCountdownUpdate) {
      onCountdownUpdate(timeLeft);
    }
  }, [timeLeft, onCountdownUpdate]);

  // Fetch auctions on mount
  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div>
      {latestAuction ? (
        <>
          <p><strong>Auction Number:</strong> {latestAuction.auction_number}</p>
          <p><strong>Start Date:</strong> {new Date(latestAuction.start_date).toLocaleString()}</p>
          <p><strong>End Date:</strong> {new Date(latestAuction.end_date).toLocaleString()}</p>
          <p><strong>End Time:</strong> {latestAuction.end_time}</p>
          <p><strong>Countdown:</strong> {timeLeft || "Calculating..."}</p>
        </>
      ) : (
        <p>Loading auctions...</p>
      )}
    </div>
  );
};

export default CountdownTimer;
