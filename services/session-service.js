"use strict";
/**
 * This file encapsulates the session-database interactions. Defines an API to create, retrieve, update and (not yet) delete [CRUD] session info
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveMessageHist = exports.saveSessionData = exports.getSessionData = exports.createSession = void 0;
const database_1 = __importDefault(require("../config/database"));
const uuid_1 = require("uuid");
/**
 * Initialize a new game session
 * @param data user session data - contains nothing useful at this point
 * @returns a new sessionID
 */
const createSession = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = (0, uuid_1.v4)();
    const queryText = "INSERT INTO sessions (session_id, data) VALUES ($1, $2)";
    const params = [sessionId, JSON.stringify(data)];
    yield database_1.default.query(queryText, params);
    return sessionId;
});
exports.createSession = createSession;
/**
 *
 * @param sessionId retrieve the data associated with a sessionId
 * @returns messageHistory of a specified game session
 */
const getSessionData = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT data FROM sessions WHERE session_id = $1';
    const { rows } = yield database_1.default.query(query, [sessionId]); //interact with database
    if (rows.length) {
        return rows[0].data; //return the data in the form of a SessionData object
    }
    else {
        return null;
    }
});
exports.getSessionData = getSessionData;
/**
 * update the data associated with a specified session
 * @param sessionId the session in question
 * @param data the new data to update with
 */
const saveSessionData = (sessionId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        INSERT INTO sessions (session_id, data)
        VALUES ($1, $2)
        ON CONFLICT (session_id) DO UPDATE
        SET data = $2, updated_at = NOW()
    `;
    // serialize the data
    const params = [sessionId, JSON.stringify(data)];
    yield database_1.default.query(query, params);
});
exports.saveSessionData = saveSessionData;
/**
 * Utility function to retrieve message history from the database
 * @param sessionId the session in question
 * @returns the data associated with this session
 */
const retrieveMessageHist = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT data FROM sessions WHERE session_id = $1';
    try {
        const { rows } = yield database_1.default.query(query, [sessionId]);
        if (rows.length) {
            const sessionData = rows[0].data;
            return sessionData.messageHist;
        }
        return []; // Return an empty array if no session data is found
    }
    catch (error) {
        console.error('Error retrieving session data:', error);
        throw new Error('Failed to retrieve message history');
    }
});
exports.retrieveMessageHist = retrieveMessageHist;
