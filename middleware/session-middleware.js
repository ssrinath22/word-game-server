"use strict";
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
exports.sessionMiddleware = void 0;
const session_service_1 = require("../services/session-service");
/**
 * wtf does this do again? TODO: figure out where this went before and what to do with this
 */
const sessionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming the session ID is passed as a cookie
        const sessionId = req.cookies['sessionId'];
        if (sessionId) {
            const sessionData = yield (0, session_service_1.getSessionData)(sessionId);
            if (sessionData) {
                req.session = sessionData;
            }
            else {
                // Initialize session data if not found
                req.session = { messageHist: [] };
            }
        }
        res.on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            if (req.session && sessionId) {
                yield (0, session_service_1.saveSessionData)(sessionId, req.session);
            }
        }));
        next();
    }
    catch (error) {
        console.error('Session Middleware Error:', error);
        next(error);
    }
});
exports.sessionMiddleware = sessionMiddleware;
