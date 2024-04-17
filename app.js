"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const game_routes_1 = require("./routes/game-routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = 8000; //potentially also use: process.env.PORT - for security
const corsOptions = {
    // origin: true, // Replace with your client's origin
    // origin: true,
    // origin:'*',
    origin: 'https://main.dy2wy1eromrq7.amplifyapp.com',
    credentials: true, // This is important to allow cookies to be shared across origins
};
app.use((0, cors_1.default)(corsOptions)); //allow all cross-origin requests
app.use((0, cookie_parser_1.default)()); //middleware for parsing cookies
app.use(express_1.default.json()); // For parsing application/json
// Use custom routes
app.use('/', game_routes_1.router);
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
exports.default = app;
