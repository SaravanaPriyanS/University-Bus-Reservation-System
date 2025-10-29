const db = require('./db');

(async () => {
  console.log('DB init script started');
  try {
    await db.init();
    console.log('DB init completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('DB init failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
