import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import CountdownTimer from "../components/countDownTimer";
import { baseUrl } from "../services/AxiosConf";

const AuctionModal = ({ auction, onClose }) => {
    const [status, setStatus] = useState("Upcoming");
    const [winningBid, setWinningBid] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [bidder, setBidder] = useState("");
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
    }, []);

    useEffect(() => {
        if (status === "ended") fetchWinningBid();
    }, [status]);

    const fetchBids = async () => {
        try {
            const response = await baseUrl.get(`/api/bids/best/${auction.id}`);
            setBids(response.data);

        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    const fetchWinningBid = async () => {
        try {
            const response = await baseUrl.get("/api/bids/best/");
            const highestBid = response.data.find(bid => bid.listing_id === auction.id);
            setWinningBid(highestBid || null);

            await baseUrl.post("/api/auctions/auction/end", {
                auction,
                winningBid: highestBid,
            });
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
            await baseUrl.post("/api/bids/bids", {
                listing_id: auction.id,
                amount: parseFloat(bidAmount),
                bidder
            });

            message.success(`Bid placed successfully by ${bidder}!`);
            setBidAmount("");
            setBidder("");
            fetchBids();
        } catch (error) {
            console.error("Error placing bid:", error);
            message.error(error.response?.data?.message || "Failed to place bid. Please try again.");
        }
    };

    const handleCountdownUpdate = (timeLeft) => {

        if (timeLeft === "0h 0m 0s") {
            setStatus("ended");
        } else if (!timeLeft) {
            setStatus("completed");
        } else {
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

                        {status !== "ended"  &&  status !== "completed" &&(
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

                {(status === "ended" || status === "completed") && (
                    <div className="auction-results">
                        <h3 className="section-title">Auction Results</h3>
                        {winningBid ? (
                            <>
                                <p className="winning-bid"><strong>Winning Bid:</strong> ${winningBid.amount}</p>
                                <p className="winning-user"><strong>Winning User:</strong> {winningBid.bidder}</p>
                            </>
                        ) : (
                            <p className="no-winner">No winners</p>
                        )}
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
                .auction-results {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    margin-top: 10px;
                    text-align: center;
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
                .no-winner {
                    font-size: 16px;
                    color: #777;
                }
            `}</style>
        </div>
    );
};

export default AuctionModal;
