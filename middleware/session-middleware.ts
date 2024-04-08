import { Request, Response, NextFunction } from 'express';
import { getSessionData, saveSessionData } from '../services/session-service';

/**
 * wtf does this do again? TODO: figure out where this went before and what to do with this
 */
export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Assuming the session ID is passed as a cookie
        const sessionId = req.cookies['sessionId'];

        if (sessionId) {
            const sessionData = await getSessionData(sessionId);
            if (sessionData) {
                req.session = sessionData;
            } else {
                // Initialize session data if not found
                req.session = { messageHist: [] };
            }
        }

        res.on('finish', async () => {
            if (req.session && sessionId) {
                await saveSessionData(sessionId, req.session);
            }
        });

        next();
    } catch (error) {
        console.error('Session Middleware Error:', error);
        next(error);
    }
};
