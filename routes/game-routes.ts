/**
 * This file encapsulates the request-controller interactions and performs routing operations.
 */

import { Router } from 'express';
import { startGame, playGame, defaultResponse, inferGame } from '../controllers/game-controller';

export const router = Router();

/**
 * facilitate the game's initial and continued states as of now
 */
router.get('/', (req, res) => {
    const respFunc = inferGame(req)
    console.log(`RESP FUNCTION: ${respFunc.name}`)
    respFunc(req,res)
});

// Additional routes for POST, PUT, DELETE can be added here
