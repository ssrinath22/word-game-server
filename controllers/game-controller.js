"use strict";
/**
 * This encapsulates the game control API that we use to facilitate user-llm-db interactions
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultResponse = exports.playGame = exports.startGame = exports.inferGame = void 0;
const llm_service_1 = require("../services/llm-service");
const session_service_1 = require("../services/session-service");
const inferGame = (req) => {
    try {
        const sessionId = req.cookies['sessionId']; // retrieve sessionId from incoming cookies
        if (!sessionId) { //if request doesn't contain a sessionID
            // console.log("SESSION ID NOT FOUND IN REQUEST, STARTING NEW GAME")
            // return startGame(req, res)
            throw new Error("SESSION ID NOT FOUND IN REQUEST, STARTING NEW GAME");
        }
        return exports.playGame;
    }
    catch (error) {
        console.log(error);
        return exports.startGame;
    }
};
exports.inferGame = inferGame;
/**
 *
 * @param req the request to start a game - doesn't contain any useful info
 * @param res pass-through variable to send a response to the caller
 */
const startGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageHist = (0, llm_service_1.init)(); //initialize message history for new game session
        const sessionId = yield (0, session_service_1.createSession)({ messageHist }); //initialize a new game session with database
        const hintResp = yield (0, llm_service_1.interact)(messageHist); //get a hint from the LLM TODO: make this a pre-decided hint
        messageHist.push({ role: "system", content: hintResp }); //add the hint to the message history
        yield (0, session_service_1.saveSessionData)(sessionId, { messageHist }); //update session history to contain hint
        res.cookie('sessionId', sessionId, { httpOnly: true }); //set sessionId in cookies
        res.send(hintResp); //send response to START
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching hint');
    }
});
exports.startGame = startGame;
/**
 *
 * @param req the request containing sessionId in cookies + user message
 * @param res pass-through variable to send an llm response to the caller
 * @returns error if request's cookies don't have sessionId
 */
const playGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.cookies['sessionId']; // retrieve sessionId from incoming cookies
        const userMessage = req.query.message; //get the latest message from the user
        // send standard response for empty message
        if (userMessage == '') {
            return res.send('Oh naiive traveler, you must ask me a question in order to garner a response...');
        }
        let messageHist = yield (0, session_service_1.retrieveMessageHist)(sessionId); //retrieve session/message history of the user
        messageHist.push({ role: "user", content: userMessage }); //add latest message to the message history
        const resp = yield (0, llm_service_1.interact)(messageHist); //facilitate another interaction with llm
        console.log(`ON PLAY, NEW RESP: ${resp}`);
        //update session history to contain latest user message + llm response to it
        messageHist.push({ role: "system", content: resp });
        yield (0, session_service_1.saveSessionData)(sessionId, { messageHist });
        res.send(resp); //send the response
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching message response');
    }
});
exports.playGame = playGame;
/**
 *
 * @param req  the request containing sessionId in cookies + user message
 * @param res  default response to specify misunderstood request params
 */
const defaultResponse = (req, res) => {
    res.send('Please specify an appropriate response state:\n 1. "Start" - to begin the game with a hint\n 2. "Play"');
};
exports.defaultResponse = defaultResponse;
