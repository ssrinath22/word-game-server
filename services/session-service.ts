/**
 * This file encapsulates the session-database interactions. Defines an API to create, retrieve, update and (not yet) delete [CRUD] session info
 */

import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

/**
 * define an type for SessionData
 */
interface SessionData {
    messageHist: Array<{ role: string; content: string }>;
}

/**
 * Initialize a new game session
 * @param data user session data - contains nothing useful at this point
 * @returns a new sessionID
 */
export const createSession = async(data: SessionData): Promise<string> => {
    const sessionId = uuidv4();
    const queryText = "INSERT INTO sessions (session_id, data) VALUES ($1, $2)"
    const params: [string, string] = [sessionId, JSON.stringify(data)];
    await pool.query(queryText, params)
    return sessionId;
}

/**
 * 
 * @param sessionId retrieve the data associated with a sessionId
 * @returns messageHistory of a specified game session
 */
export const getSessionData = async (sessionId: string): Promise<SessionData | null> => {
    const query = 'SELECT data FROM sessions WHERE session_id = $1';
    const { rows } = await pool.query(query, [sessionId]); //interact with database

    if (rows.length) {
        return rows[0].data as SessionData; //return the data in the form of a SessionData object
    } else {
        return null;
    }
};

/**
 * update the data associated with a specified session
 * @param sessionId the session in question
 * @param data the new data to update with
 */
export const saveSessionData = async (sessionId: string, data: SessionData): Promise<void> => {
    const query = `
        INSERT INTO sessions (session_id, data)
        VALUES ($1, $2)
        ON CONFLICT (session_id) DO UPDATE
        SET data = $2, updated_at = NOW()
    `;

    // serialize the data
    const params: [string, string] = [sessionId, JSON.stringify(data)];
    
    await pool.query(query, params);
};

/**
 * Utility function to retrieve message history from the database
 * @param sessionId the session in question
 * @returns the data associated with this session
 */
export const retrieveMessageHist = async (sessionId: string): Promise<Array<{ role: string; content: string }>> => {
    const query = 'SELECT data FROM sessions WHERE session_id = $1';
    try {
        const { rows } = await pool.query(query, [sessionId]);
        if (rows.length) {
            const sessionData: SessionData = rows[0].data as SessionData;
            return sessionData.messageHist;
        }
        return []; // Return an empty array if no session data is found
    } catch (error) {
        console.error('Error retrieving session data:', error);
        throw new Error('Failed to retrieve message history');
    }
};
