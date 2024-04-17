"use strict";
const handler = require('serverless-express/handler');
const app = require('./app').default;
module.exports.api = handler(app);
