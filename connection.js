const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

exports.PG_POOL = pool;
