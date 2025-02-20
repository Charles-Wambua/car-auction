
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_number VARCHAR(50) UNIQUE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bidders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO auctions (id, auction_number, start_time, end_time) VALUES
(uuid_generate_v4(), 'AUCTION-001', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-002', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-003', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-004', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-005', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-006', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-007', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-008', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-009', NOW(), NOW() + INTERVAL '7 days'),
(uuid_generate_v4(), 'AUCTION-010', NOW(), NOW() + INTERVAL '7 days');

INSERT INTO listings (id, auction_id, title, description, base_price, image_url, created_at) VALUES
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-001'), '2020 Tesla Model S', 'Luxury electric sedan with autopilot.', 50000, 'https://storage.googleapis.com/images-auction/tesla.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-001'), '2018 Honda Civic', 'Reliable and fuel-efficient compact car.', 18000, 'https://storage.googleapis.com/images-auction/hondacivic.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-002'), '2019 BMW X5', 'Luxury SUV with advanced technology.', 45000, 'https://storage.googleapis.com/images-auction/x5.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-002'), '2021 Ford Mustang', 'Iconic muscle car with powerful engine.', 35000, 'https://storage.googleapis.com/images-auction/fordmustang.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-003'), '2017 Toyota Corolla', 'Compact sedan with great mileage.', 15000, 'https://storage.googleapis.com/images-auction/toyotacorolla.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-003'), '2022 Chevrolet Camaro', 'High-performance sports coupe.', 40000, 'https://storage.googleapis.com/images-auction/chevcamaro.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-004'), '2019 Nissan Altima', 'Spacious sedan with modern features.', 20000, 'https://storage.googleapis.com/images-auction/nissanaltima.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-004'), '2016 Audi A4', 'Premium compact sedan.', 22000, 'https://storage.googleapis.com/images-auction/audia4.jpg', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-005'), '2020 Mercedes C-Class', 'Luxury sedan with cutting-edge tech.', 38000, 'https://storage.googleapis.com/images-auction/merc-c-class.png', NOW()),
(uuid_generate_v4(), (SELECT id FROM auctions WHERE auction_number = 'AUCTION-005'), '2015 Hyundai Elantra', 'Affordable and fuel-efficient.', 12000, 'https://storage.googleapis.com/images-auction/hyudaielatra.jpg', NOW());

ALTER TABLE bids ADD COLUMN is_below_base_price BOOLEAN DEFAULT FALSE;
ALTER TABLE bids ADD COLUMN bidder TEXT;
ALTER TABLE listings ADD COLUMN best_offer DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN best_bidder TEXT;
