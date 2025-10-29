const db = require('./db');
(async () => {
  try {
    console.log('Attempting SELECT COUNT(*) from bookings...');
    const rows = await db.query('SELECT COUNT(*) AS cnt FROM bookings');
    console.log('Query succeeded:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Query failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
