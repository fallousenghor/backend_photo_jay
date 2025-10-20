"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
exports.createUserSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.USER_USERNAME_REQUIRED),
    email: zod_1.z.string().email(errorMessage_1.ERROR_MESSAGES.USER_EMAIL_INVALID),
    password: zod_1.z.string().min(6, errorMessage_1.ERROR_MESSAGES.USER_PASSWORD_TOO_SHORT),
    role: zod_1.z.enum(['USER', 'MODERATEUR', 'ADMIN']),
    isVIP: zod_1.z.boolean().optional(),
    phoneNumber: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    whatsappNumber: zod_1.z.string().optional(),
    shopLink: zod_1.z.string().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.USER_USERNAME_REQUIRED).optional(),
    email: zod_1.z.string().email(errorMessage_1.ERROR_MESSAGES.USER_EMAIL_INVALID).optional(),
    password: zod_1.z.string().min(6, errorMessage_1.ERROR_MESSAGES.USER_PASSWORD_TOO_SHORT).optional(),
    role: zod_1.z.enum(['USER', 'MODERATEUR', 'ADMIN']).optional(),
    isVIP: zod_1.z.boolean().optional(),
    phoneNumber: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    whatsappNumber: zod_1.z.string().optional(),
    shopLink: zod_1.z.string().optional(),
});
exports.registerSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.USER_USERNAME_REQUIRED),
    email: zod_1.z.string().email(errorMessage_1.ERROR_MESSAGES.USER_EMAIL_INVALID),
    password: zod_1.z.string().min(6, errorMessage_1.ERROR_MESSAGES.USER_PASSWORD_TOO_SHORT),
    isVIP: zod_1.z.boolean().optional(),
    phoneNumber: zod_1.z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    whatsappNumber: zod_1.z.string().optional(),
    shopLink: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(errorMessage_1.ERROR_MESSAGES.USER_EMAIL_INVALID),
    password: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.USER_PASSWORD_REQUIRED),
});
