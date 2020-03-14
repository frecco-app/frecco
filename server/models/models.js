const { Pool } = require('pg');

const PG_URI = 'postgres://gbvvwuut:TEe4IC-3z60pyYhpUHAkpFujeaWbXDcO@drona.db.elephantsql.com:5432/gbvvwuut';

// create a new pool here using the connection string above
const pool = new Pool({
    connectionString: PG_URI,
  });

module.exports = {
    query: (text, params, callback) => {
        console.log('executed query', text);
        return pool.query(text, params, callback);
    },
};