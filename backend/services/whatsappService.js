import { sendWhatsAppMessage } from "../whatsappClient"; // Import the function

const fetchWinningBid = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/bids/best/");
    const highestBid = response.data.find(bid => bid.listing_id === auction.id);
    setWinningBid(highestBid || null);

    if (status === "ended") {
      const phoneNumber = "YOUR_TEST_PHONE_NUMBER"; // Change this to your dedicated test number

      const message = highestBid
        ? `Auction ID: ${auction.id}
        Title: ${auction.title}
        Winning Bid: $${highestBid.amount}
        Winning User: ${highestBid.bidder}`
        : `Auction ID: ${auction.id}
        Title: ${auction.title}
        No winning bids`;

      sendWhatsAppMessage(phoneNumber, message);
    }
  } catch (error) {
    console.error("Error fetching winning bid:", error);
  }
};
