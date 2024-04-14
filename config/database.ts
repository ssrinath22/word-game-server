import { Pool } from 'pg';

/**
 * Initializes a new postgresq connection to a database. TODO: store this information in the environment for security purposes.  
 */
// const pool = new Pool({
//     user: 'sidharthsrinath',
//     host: 'localhost',
//     database: 'myappdb',
//     password: '1234',
//     port: 5432,
// });
// const pool = new Pool({
//     user:'postgres',
//     host:'database-1.cluster-ro-crc2o6smie07.us-west-1.rds.amazonaws.com',
//     database:'database-1',
//     password:'masterpostgres1234',
//     port:5432,
// })

// pool.connect(err => {
//     if (err) {
//         console.error('connection error', err.stack);
//     } else {
//         console.log('connected to database');
//     }
// })

// Create a pool using the connection string from Heroku environment variable
const pool = new Pool({
    connectionString: ---,
    ssl: {
        rejectUnauthorized: false // required for Heroku's self-signed certificate
    }
})

export default pool;
