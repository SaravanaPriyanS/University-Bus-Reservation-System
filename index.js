require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { query, init } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve the frontend file (UBR.html) from the project root
app.use(express.static(path.join(__dirname, '..')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Get bookings (optionally filter by date)
// We alias DB columns to match the frontend's expected property names (from, to)
app.get('/api/bookings', async (req, res) => {
  try {
    const { date } = req.query;
    let rows;
    const select = `SELECT id, name, registerNumber, department, from_location AS \`from\`, to_location AS \`to\`, date, seat, timing FROM bookings`;
    if (date) {
      rows = await query(select + ' WHERE date = ? ORDER BY created_at ASC', [date]);
    } else {
      rows = await query(select + ' ORDER BY created_at ASC');
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booked seats for a given date
app.get('/api/bookedSeats', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Missing date query parameter' });
    const rows = await query('SELECT seat FROM bookings WHERE date = ?', [date]);
    const seats = rows.map(r => r.seat);
    res.json(seats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch booked seats' });
  }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { id, name, registerNumber, department, from: from_location, to: to_location, date, seat, timing } = req.body;

    // Basic required fields
    const missing = [];
    if (!name) missing.push('name');
    if (!registerNumber) missing.push('registerNumber');
    if (!department) missing.push('department');
    if (!from_location) missing.push('from');
    if (!to_location) missing.push('to');
    if (!date) missing.push('date');
    if (!seat) missing.push('seat');
    if (missing.length) return res.status(400).json({ error: 'Missing required fields', missing });

    // Validate seat format: rows A-J (10) and seats 1-4 => e.g., A1..J4
    const seatRe = /^[A-J][1-4]$/;
    if (!seatRe.test(String(seat))) return res.status(400).json({ error: 'Invalid seat format. Expected A1..J4' });

    // Validate date format YYYY-MM-DD and not in the past
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRe.test(String(date))) return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD' });
    const provided = new Date(date + 'T00:00:00');
    if (isNaN(provided.getTime())) return res.status(400).json({ error: 'Invalid date value' });
    const today = new Date();
    today.setHours(0,0,0,0);
    if (provided < today) return res.status(400).json({ error: 'Date cannot be in the past' });

    // Limit lengths to avoid overly long inputs
    if (String(name).length > 255) return res.status(400).json({ error: 'Name too long' });
    if (String(registerNumber).length > 128) return res.status(400).json({ error: 'Register number too long' });

    // Insert booking
    const bookingId = id || Date.now().toString();
    await query(
      `INSERT INTO bookings (id, name, registerNumber, department, from_location, to_location, date, seat, timing)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [bookingId, name, registerNumber, department, from_location, to_location, date, seat, timing || null]
    );

    const inserted = await query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Delete all bookings
app.delete('/api/bookings', async (req, res) => {
  try {
    await query('DELETE FROM bookings');
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete bookings' });
  }
});

// Initialize DB table then start server
(async function start() {
  try {
    await init();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database. Server will still start but DB calls may fail.');
    console.error(err.message || err);
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  }
})();
