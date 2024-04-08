/**
 * This encapsulates the game control API that we use to facilitate user-llm-db interactions
 */

import { Request, Response } from 'express';
import { interact, init } from '../services/llm-service'; 
import { createSession, saveSessionData, retrieveMessageHist } from '../services/session-service';

export const inferGame = (req:Request) => {
    try{
        const sessionId = req.cookies['sessionId']; // retrieve sessionId from incoming cookies

        if (!sessionId) { //if request doesn't contain a sessionID
            // console.log("SESSION ID NOT FOUND IN REQUEST, STARTING NEW GAME")
            // return startGame(req, res)
            throw new Error("SESSION ID NOT FOUND IN REQUEST, STARTING NEW GAME")
        } 
        return playGame
    }
    catch(error){
        console.log(error)
        return startGame
    }
}

/**
 * 
 * @param req the request to start a game - doesn't contain any useful info
 * @param res pass-through variable to send a response to the caller
 */
export const startGame = async (req: Request, res: Response) => {
    try {
        const messageHist = init(); //initialize message history for new game session
        const sessionId = await createSession({messageHist}); //initialize a new game session with database
        const hintResp = await interact(messageHist); //get a hint from the LLM TODO: make this a pre-decided hint
        messageHist.push({ role: "system", content: hintResp }); //add the hint to the message history
        await saveSessionData(sessionId, {messageHist}); //update session history to contain hint
 
        res.cookie('sessionId', sessionId, {httpOnly: true}) //set sessionId in cookies
        return res.send(hintResp); //send response to START
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching hint');
    }
};

/**
 * 
 * @param req the request containing sessionId in cookies + user message
 * @param res pass-through variable to send an llm response to the caller 
 * @returns error if request's cookies don't have sessionId
 */
export const playGame = async (req: Request, res: Response) => {

    try {
        const sessionId = req.cookies['sessionId']; // retrieve sessionId from incoming cookies
        const userMessage = req.query.message as string; //get the latest message from the user

        // send standard response for empty message
        if(userMessage == ''){
            return res.send('Oh naiive traveler, you must ask me a question in order to garner a response...')
        }

        let messageHist = await retrieveMessageHist(sessionId); //retrieve session/message history of the user
        messageHist.push({ role: "user", content: userMessage }); //add latest message to the message history

        const resp = await interact(messageHist); //facilitate another interaction with llm

        console.log(`ON PLAY, NEW RESP: ${resp}`)

        //update session history to contain latest user message + llm response to it
        messageHist.push({ role: "system", content: resp }); 
        await saveSessionData(sessionId, {messageHist}); 
        
        return res.send(resp); //send the response
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching message response');
    }
};

/**
 * 
 * @param req  the request containing sessionId in cookies + user message 
 * @param res  default response to specify misunderstood request params
 */
export const defaultResponse = (req: Request, res: Response) => {
    return res.send('Please specify an appropriate response state:\n 1. "Start" - to begin the game with a hint\n 2. "Play"');
};
