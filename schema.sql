-- Create database (run if database doesn't exist):
-- CREATE DATABASE ubrs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database before running the create table.

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  registerNumber VARCHAR(128) NOT NULL,
  department VARCHAR(128) NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  date VARCHAR(50) NOT NULL,
  seat VARCHAR(16) NOT NULL,
  timing VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
