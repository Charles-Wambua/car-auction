# Car Auction

## Overview
Car Auction is a digital trading platform where users can bid on vehicles in an online auction system. The platform includes a backend built with Node.js, Express, and PostgreSQL, and a frontend developed using React. It also integrates WhatsApp notifications for auction results.

## Hosted Application
The project is hosted at: [Car Auction Platform](http://34.78.213.218/)

The database is also accessible on the hosted server.

## Features
### 1. Listing Items (Auction Setup)
- Admins can create auction listings with:
  - Unique Auction ID
  - Title/Description (e.g., "2018 Honda Civic")
  - Base Price
  - Start and End Time
  - Auction Number (batching auctions together)

### 2. Bidding System
- Users can place bids (offers) on active auctions:
  - Equal to the Base Price (Match)
  - Higher than the Base Price
  - Lower than the Base Price (marked as non-winning bids)
- The highest bid wins at the end of the auction.
- Bidding is only allowed within the trading window.

### 3. Auction Status
- **Upcoming:** Before auction start time
- **Active:** During the bidding period
- **Ended:** After auction end time

### 4. WhatsApp Integration
- Sends a notification to a predefined WhatsApp number when an auction ends.

---

## Installation & Setup

### Clone the Repository
```sh
git clone https://github.com/Charles-Wambua/car-auction.git
cd car-auction
```

### Backend Setup
1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Start the server in development mode:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Run the frontend:
   ```sh
   npm start
   ```

The frontend should now be accessible in your browser.

---

## API Endpoints

### **Listing Auctions**
- **GET** `/api/auctions` - Retrieve all auctions
- **POST** `/api/auctions` - Create a new auction

### **Bidding System**
- **POST** `/api/bids` - Place a bid
- **GET** `/api/bids/:auctionId` - Retrieve all bids for a specific auction

### **WhatsApp Notifications**
- Sent automatically when an auction ends.

---

## Tech Stack
- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React.js
- **Real-time Updates:** WebSockets
- **Messaging:** WhatsApp Web API

---

## Contributing
If you'd like to contribute:
1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Submit a pull request

---

## License
This project is licensed under the MIT License.

For any inquiries, contact **Charles Wambua**.

