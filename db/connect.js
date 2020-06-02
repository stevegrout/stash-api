const Pool = require('pg').Pool;

exports.pool = new Pool({
  user: 'stash',
  host: 'localhost',
  database: 'stash_db',
  password: 'password',
  port: 5432,
});
