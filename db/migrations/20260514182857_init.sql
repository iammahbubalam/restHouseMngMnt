-- migrate:up

-- Users table (synced from Google OAuth on first login)
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Buildings table
CREATE TABLE buildings (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    code        VARCHAR(50) UNIQUE NOT NULL
);

-- Rooms table
CREATE TABLE rooms (
    id          SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    UNIQUE(building_id, room_number)
);

-- Bookings table
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    booking_date    DATE NOT NULL,               -- The single day booked
    booked_by       UUID NOT NULL REFERENCES users(id),
    comment         TEXT,                        -- Free-text details
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent double-booking: same room + date = unique
    CONSTRAINT unique_room_date UNIQUE (room_id, booking_date)
);

-- Indexes for fast lookups
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_room_date ON bookings(room_id, booking_date);
CREATE INDEX idx_bookings_booked_by ON bookings(booked_by);

-- Initial Data Seed (Buildings & Rooms)
INSERT INTO buildings (name, code) VALUES 
('VIP Rest House', 'vip_rest_house'),
('Biddut Bhaban', 'biddut_bhaban');

-- VIP Rest House Rooms (101-106)
INSERT INTO rooms (building_id, room_number) 
SELECT id, '10' || generate_series(1, 6) FROM buildings WHERE code = 'vip_rest_house';

-- Biddut Bhaban Rooms (201-205)
INSERT INTO rooms (building_id, room_number) 
SELECT id, '20' || generate_series(1, 5) FROM buildings WHERE code = 'biddut_bhaban';

-- migrate:down
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS buildings;
DROP TABLE IF EXISTS users;
