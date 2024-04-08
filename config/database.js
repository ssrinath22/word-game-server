"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
/**
 * Initializes a new postgresq connection to a database. TODO: store this information in the environment for security purposes.
 */
const pool = new pg_1.Pool({
    user: 'sidharthsrinath',
    host: 'localhost',
    database: 'myappdb',
    password: '1234',
    port: 5432,
});
exports.default = pool;
