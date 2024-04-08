import { Pool } from 'pg';

/**
 * Initializes a new postgresq connection to a database. TODO: store this information in the environment for security purposes.  
 */
const pool = new Pool({
    user: 'sidharthsrinath',
    host: 'localhost',
    database: 'myappdb',
    password: '1234',
    port: 5432,
});

export default pool;
