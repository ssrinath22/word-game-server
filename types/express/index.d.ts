/**
 * Define custom interfaces for our app.
 */
import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface SessionData {
        messageHist: Array<{ role: string; content: string }>;
    }

    interface Request {
        session?: SessionData; // Use optional property to account for cases where session might not be set
    }
}