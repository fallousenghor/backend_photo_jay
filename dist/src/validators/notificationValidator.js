"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
exports.createNotificationSchema = zod_1.z.object({
    userId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.USER_ID_INVALID),
    type: zod_1.z.enum(['REPUBLISH', 'GENERAL']),
    message: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED),
    isRead: zod_1.z.boolean().optional(),
});
exports.updateNotificationSchema = zod_1.z.object({
    userId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.USER_ID_INVALID).optional(),
    type: zod_1.z.enum(['REPUBLISH', 'GENERAL']).optional(),
    message: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED).optional(),
    isRead: zod_1.z.boolean().optional(),
});
