"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModerationLogSchema = exports.createModerationLogSchema = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
exports.createModerationLogSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.PRODUCT_ID_INVALID),
    moderatorId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.MODERATOR_ID_INVALID),
    action: zod_1.z.enum(['APPROVED', 'REJECTED']),
    reason: zod_1.z.string().optional(),
});
exports.updateModerationLogSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.PRODUCT_ID_INVALID).optional(),
    moderatorId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.MODERATOR_ID_INVALID).optional(),
    action: zod_1.z.enum(['APPROVED', 'REJECTED']).optional(),
    reason: zod_1.z.string().optional(),
});
