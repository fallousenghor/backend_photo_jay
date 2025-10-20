"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const auth_1 = require("../utils/auth");
const errorMessage_1 = require("../utils/messages/errorMessage");
const errorCode_1 = require("../utils/codes/errorCode");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED });
    }
    const token = authHeader.substring(7);
    const decoded = (0, auth_1.verifyToken)(token);
    if (!decoded) {
        return res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ message: errorMessage_1.ERROR_MESSAGES.UNAUTHORIZED });
    }
    req.user = decoded;
    next();
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(errorCode_1.ErrorCode.FORBIDDEN).json({ message: errorMessage_1.ERROR_MESSAGES.FORBIDDEN });
        }
        next();
    };
};
exports.authorize = authorize;
