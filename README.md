# University Bus Reservation - Backend

This is a small Express backend using MySQL (mysql2) to store bus bookings for the provided frontend `UBR.html`.

Features
- Create bookings (POST /api/bookings)
- List bookings (GET /api/bookings)
- Delete all bookings (DELETE /api/bookings)
- Get booked seats for a date (GET /api/bookedSeats?date=YYYY-MM-DD)

Quick start
1. Install dependencies (already done if you ran earlier step):

   npm install

2. Create a MySQL database (example name `ubrs`) and set environment variables or copy `.env.example` to `.env` and update values.

   -- Example SQL:
   CREATE DATABASE ubrs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE ubrs;
   -- Then run the `schema.sql` file to create the table (or let the server create it automatically):

3. Start the server:

   node index.js

4. Open `UBR.html` in your browser. By default the server serves static files from the repository root and is CORS-enabled, so the frontend can call the APIs.

Notes
- The server attempts to create the `bookings` table on startup. If the database is unreachable you'll see logged errors — ensure MySQL is running and credentials are correct.
- This is intentionally minimal. If you want authentication, validation, transactions, or concurrency guards (to avoid double-booking seats), we can add them next.
