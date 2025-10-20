"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
exports.createProductSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.PRODUCT_TITLE_REQUIRED),
    description: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED),
    price: zod_1.z.number().optional(),
    userId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.USER_ID_INVALID),
    categoryId: zod_1.z.number().int().positive().optional(),
    expiresAt: zod_1.z.string().datetime(errorMessage_1.ERROR_MESSAGES.PRODUCT_EXPIRES_AT_INVALID).transform((val) => new Date(val)).optional(),
    priority: zod_1.z.boolean().optional(),
});
exports.updateProductSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.PRODUCT_TITLE_REQUIRED).optional(),
    description: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED).optional(),
    price: zod_1.z.number().optional(),
    categoryId: zod_1.z.number().int().positive().optional(),
    expiresAt: zod_1.z.string().datetime(errorMessage_1.ERROR_MESSAGES.PRODUCT_EXPIRES_AT_INVALID).transform((val) => new Date(val)).optional(),
    priority: zod_1.z.boolean().optional(),
});
