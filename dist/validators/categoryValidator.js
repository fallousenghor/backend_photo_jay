"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.CATEGORY_NAME_REQUIRED),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, errorMessage_1.ERROR_MESSAGES.CATEGORY_NAME_REQUIRED).optional(),
});
