import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import CountdownTimer from "../components/countDownTimer";

const AuctionModal = ({ auction, onClose }) => {
    const [status, setStatus] = useState("Upcoming");
    const [winningBid, setWinningBid] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [bidder, setBidder] = useState(""); // NEW: Bidder Input
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
        console.log("auction receiverd", auction)
    }, []);

    useEffect(() => {
        if (status === "Auction ended") {
            fetchWinningBid();
        }
    }, [status]);

    const fetchBids = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bids/best/${auction.id}`);
            setBids(response.data);
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    const fetchWinningBid = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bids/best/${auction.id}`);
            setWinningBid(response.data);
        } catch (error) {
            console.error("Error fetching winning bid:", error);
        }
    };

    const placeBid = async () => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
            message.warning("Please enter a valid bid amount!");
            return;
        }

        if (!bidder.trim()) {
            message.warning("Please enter your name to place a bid!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/bids/bids", {
                listing_id: auction.id,
                amount: parseFloat(bidAmount),
                bidder: bidder, // Include bidder's name
            });

            message.success(`Bid placed successfully by ${bidder}!`);
            setBidAmount("");
            setBidder(""); // Clear bidder input after submitting
            fetchBids();
        } catch (error) {
            console.error("Error placing bid:", error);

            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Failed to place bid. Please try again.");
            }
        }
    };

    const handleCountdownUpdate = (timeLeft) => {
        if (timeLeft === "Auction ended") {
            setStatus("Auction ended");
        } else if (timeLeft) {
            setStatus("Active");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-body">
                    <img src={auction.image_url} alt={auction.title} className="auction-image" />
                    <div className="auction-details">
                        <h2 className="auction-title">{auction.title}</h2>
                        <CountdownTimer onCountdownUpdate={handleCountdownUpdate} />

                        {/* Bid Placement */}
                        {status !== "Auction ended" && (
                            <div className="bid-section">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={bidder}
                                    onChange={(e) => setBidder(e.target.value)}
                                    className="bidder-input"
                                />
                                <input
                                    type="number"
                                    placeholder="Enter bid amount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    className="bid-input"
                                />
                                <button onClick={placeBid} className="bid-button">Submit Bid</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="divider"></div>

                {/* Bids Section */}
                <div className="bids-container">
                    <h3 className="section-title">Bids</h3>
                    <div className="bids-list">
                        {bids.length > 0 ? (
                            <ul>
                                {bids.map((bid) => (
                                    <li key={bid.id} className="bid-item">
                                        <span className="bidder-name">{bid.bidder}</span> {/* Display bidder */}
                                        <span className="bid-amount">${bid.amount}</span>
                                        <span className="bid-time">{new Date(bid.created_at).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-bids">No bids placed yet.</p>
                        )}
                    </div>
                </div>

                {/* Auction Results (Displayed When Ended) */}
                {status === "Auction ended" && (
                    <div className="auction-results">
                        <h3 className="section-title">Auction Results</h3>
                        <p className="winning-bid"><strong>Winning Bid:</strong> {winningBid?.amount ? `$${winningBid.amount}` : "No bids"}</p>
                        <p className="winning-user"><strong>Winning User:</strong> {winningBid?.bidder || "N/A"}</p> {/* Display winning bidder */}
                    </div>
                )}
            </div>

            <style jsx>{`
                .modal-body {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }
                .auction-image {
                    width: 50%;
                    max-height: 300px;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .auction-details {
                    flex: 1;
                    text-align: left;
                }
                .status {
                    font-size: 18px;
                    color: ${status === "Active" ? "green" : status === "Ended" ? "red" : "blue"};
                    font-weight: bold;
                }
                .bid-section {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .bidder-input,
                .bid-input {
                    padding: 10px;
                    width: 150px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .bid-button {
                    padding: 10px 15px;
                    background: #007bff;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: background 0.3s;
                }
                .bid-button:hover {
                    background: #0056b3;
                }
                .bids-container, .auction-results {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    margin-top: 10px;
                }
                .bid-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #ddd;
                    font-size: 16px;
                }
                .bidder-name {
                    font-weight: bold;
                    color: #007bff;
                }
                .bid-amount {
                    font-weight: bold;
                    color: #28a745;
                }
                .bid-time {
                    font-size: 14px;
                    color: #666;
                }
                .no-bids {
                    text-align: center;
                    color: #777;
                }
                .winning-bid {
                    font-size: 18px;
                    font-weight: bold;
                    color: #d9534f;
                }
                .winning-user {
                    font-size: 16px;
                    color: #333;
                }
            `}</style>
        </div>
    );
};

export default AuctionModal;
