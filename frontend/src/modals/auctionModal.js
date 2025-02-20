import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

const AuctionModal = ({ auction, onClose }) => {
    const [status, setStatus] = useState("Auto");
    const [winningBid, setWinningBid] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
    }, []);

    useEffect(() => {
        if (status === "Ended") {
            fetchWinningBid();
        }
    }, [status]);

    const fetchBids = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bids/bidsget/${auction.id}`);
            setBids(response.data);
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    const fetchWinningBid = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bids/winning/${auction.id}`);
            setWinningBid(response.data);
        } catch (error) {
            console.error("Error fetching winning bid:", error);
        }
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const placeBid = async () => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
            message.warning("Please enter a valid bid amount!");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:5000/api/bids/bids", {
                listing_id: auction.id,
                amount: parseFloat(bidAmount),
            });
    
            message.success("Bid placed successfully!");
            setBidAmount("");
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
    

    const calculateRemainingTime = () => {
        const now = new Date();
        const end = new Date(auction.end_time);
        const diff = end - now;

        if (diff <= 0) return "Auction ended";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-body">
                    <img src={auction.image_url} alt={auction.title} className="auction-image" />
                    <div className="auction-details">
                        <h2 className="auction-title">{auction.title}</h2>
                        <p><strong>Start Time:</strong> {new Date(auction.start_time).toLocaleString()}</p>
                        <p><strong>End Time:</strong> {new Date(auction.end_time).toLocaleString()}</p>
                        <p className="countdown"><strong>Countdown:</strong> {calculateRemainingTime()}</p>
                        <label className="status-label">
                            <strong>Status:</strong>
                            <select value={status} onChange={handleStatusChange} className="status-select">
                                <option value="Auto">Auto</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Active">Active</option>
                                <option value="Ended">Ended</option>
                            </select>
                        </label>
                        <div style={{marginTop:10}}>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Enter bid amount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    className="bid-input"
                                />
                                <button onClick={placeBid} className="bid-button">Submit Bid</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="divider"></div>
               
                <div className="bids-container">
    <h3 className="section-title">Bids</h3>
    <div className="bids-list">
        {bids.length > 0 ? (
            <ul>
                {bids.map((bid) => (
                    <li key={bid.id} className="bid-item">
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
                {status === "Ended" && (
                    <div className="auction-results">
                        <h3 className="section-title">Auction Results</h3>
                        <p className="winning-bid"><strong>Winning Bid:</strong> {winningBid?.amount ? `$${winningBid.amount}` : "No bids"}</p>
                        <p className="winning-user"><strong>Winning User:</strong> {winningBid?.winning_user || "N/A"}</p>
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
                .countdown {
                    font-size: 18px;
                    color: red;
                    font-weight: bold;
                }
                .status-label {
                    display: block;
                    margin-top: 10px;
                }
                .status-select {
                    padding: 8px;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .bid-input-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 10px;
                }
                   .bids-container, .auction-results {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}

.section-title {
    font-size: 18px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
}

.bid-box {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
}

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

.bids-list {
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.bid-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
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
