"use strict";
/**
 * This file encapsulates the request-controller interactions and performs routing operations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const game_controller_1 = require("../controllers/game-controller");
exports.router = (0, express_1.Router)();
/**
 * facilitate the game's initial and continued states as of now
 */
exports.router.get('/', (req, res) => {
    // console.log(req)
    const respFunc = (0, game_controller_1.inferGame)(req);
    console.log(`RESP FUNCTION: ${respFunc.name}`);
    respFunc(req, res);
});
// Additional routes for POST, PUT, DELETE can be added here
