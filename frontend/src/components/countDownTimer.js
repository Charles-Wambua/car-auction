import { useState, useEffect } from "react";
import axios from "axios";
import {baseUrl} from '../services/AxiosConf'

const CountdownTimer = ({ onCountdownUpdate }) => {
  const [latestAuction, setLatestAuction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("Loading...");

  // Fetch latest auction
  const fetchAuctions = async () => {
    try {
      const res = await baseUrl.get("/api/auctions/auction-dates");
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
        setStatus("No auctions available");
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setStatus("Error fetching auctions");
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
      
      // Ensure the time is set correctly
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
    <div>
      {latestAuction ? (
        <>
          <p><strong>Auction Number:</strong> {latestAuction.auction_number}</p>
          <p><strong>Start Date:</strong> {new Date(latestAuction.start_date).toLocaleString()}</p>
          <p><strong>End Date:</strong> {new Date(latestAuction.end_date).toLocaleString()}</p>
          <p><strong>End Time:</strong> {latestAuction.end_time}</p>
          <p className="status"><strong>Status:</strong> {status}</p>
          {status === "Active" && <p><strong>Countdown:</strong> {timeLeft || "Calculating..."}</p>}
        </>
      ) : (
        <p>{status}</p>
      )}
        <style jsx>{`
              
                .status {
                    font-size: 18px;
                    color: ${status === "Active" ? "green" : status === "Auction ended" ? "red" : "blue"};
                    font-weight: bold;
                }
            `}</style>
    </div>
  );
};

export default CountdownTimer;
