"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
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
const pool = new pg_1.Pool({
    connectionString: 'postgres://ublvaslob835ut:p6ee9e0c5d5167ebf11843b0e7b7e57856011b5284b79efa8b3bb4846a33a2a90@c7gljno857ucsl.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d3qsesr7bim98v',
    ssl: {
        rejectUnauthorized: false // required for Heroku's self-signed certificate
    }
});
exports.default = pool;
