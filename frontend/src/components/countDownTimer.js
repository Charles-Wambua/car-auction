import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../services/AxiosConf";
import { message } from "antd";

const CountdownTimer = ({ onCountdownUpdate }) => {
  const [latestAuction, setLatestAuction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [resetting, setResetting] = useState(false); // Track reset state

  // Fetch latest auction
  const fetchAuctions = async () => {
    try {
      const res = await baseUrl.get("/api/auctions/auction-dates");
      console.log("Fetched auctions:", res.data);

      if (res.data.length > 0) {
        const latest = res.data.reduce((latest, current) =>
          new Date(current.created_at) > new Date(latest.created_at) ? current : latest
        );

        console.log("Latest auction selected:", latest);
        setLatestAuction(latest);
      } else {
        console.warn("No auctions found.");
        setStatus("No auctions available");
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setStatus("Error fetching auctions");
    }
  };

 // Reset bids function
const resetBids = async () => {
  if (!window.confirm("Are you sure you want to reset all bids?")) {
    return; // Prevent accidental resets
  }

  setResetting(true);

  try {
    await baseUrl.delete(`/api/bids/reset`);
    message.success("Bids have been reset successfully!");
  } catch (error) {
    console.error("Error resetting bids:", error.response?.data || error.message);
    message.error("Failed to reset bids. Please try again.");
  } finally {
    setResetting(false);
  }
};



  // Calculate countdown time left and determine status
  useEffect(() => {
    if (!latestAuction) return;

    const updateCountdown = () => {
      const now = new Date();
      const startDateTime = new Date(latestAuction.start_date);
      const endDateTime = new Date(latestAuction.end_date);
      const [hours, minutes, seconds] = latestAuction.end_time.split(":").map(Number);

      endDateTime.setHours(hours, minutes, seconds, 0);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.error("Invalid auction dates:", startDateTime, endDateTime);
        setStatus("Invalid auction time");
        setTimeLeft(null);
        return;
      }

      if (now < startDateTime) {
        setStatus("Upcoming");
        setTimeLeft(null);
        return;
      }

      if (now >= startDateTime && now < endDateTime) {
        setStatus("Active");
        const difference = endDateTime - now;

        const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
        const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
      } else {
        setStatus("Auction ended");
        setTimeLeft(null);
      }
    };

    updateCountdown(); // Call immediately
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
    <div className="auction-container">
      {latestAuction ? (
        <>
          <div className="auction-info">
            <p><strong>Auction Number:</strong> {latestAuction.auction_number}</p>
            <p><strong>Start Date:</strong> {new Date(latestAuction.start_date).toLocaleString()}</p>
            <p><strong>End Date:</strong> {new Date(latestAuction.end_date).toLocaleString()}</p>
            <p><strong>End Time:</strong> {latestAuction.end_time}</p>
            <p className="status"><strong>Status:</strong> {status}</p>
            {status === "Active" && <p><strong>Countdown:</strong> {timeLeft || "Calculating..."}</p>}
          </div>
          <button className="reset-button" onClick={resetBids} disabled={resetting}>
            {resetting ? "Resetting..." : "Reset Bids"}
          </button>
        </>
      ) : (
        <p>{status}</p>
      )}

      <style jsx>{`
      .auction-container {
  display: flex;
  align-items: center; /* Align items vertically */
  justify-content: space-between; /* Keep spacing between items */
  gap: 15px;
  max-width: 500px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Center the whole container */
  margin: auto; /* Centers it horizontally */
}


        .auction-info p {
          margin: 5px 0;
          font-size: 16px;
        }

        .status {
          font-size: 18px;
          color: ${status === "Active" ? "green" : status === "Auction ended" ? "red" : "blue"};
          font-weight: bold;
        }

        .reset-button {
          background: #ff4d4f;
          color: white;
          border: none;
          padding: 8px 15px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .reset-button:hover {
          background: #d9363e;
        }

        .reset-button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;
