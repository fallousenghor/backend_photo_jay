"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
const successCode_1 = require("../utils/codes/successCode");
const errorCode_1 = require("../utils/codes/errorCode");
const categoryValidator_1 = require("../validators/categoryValidator");
class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(req, res) {
        try {
            const data = categoryValidator_1.createCategorySchema.parse(req.body);
            const category = await this.categoryService.create(data);
            res.status(successCode_1.SuccessCode.CREATED).json(category);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: error.issues });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const category = await this.categoryService.findById(id);
            if (!category) {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.CATEGORY_NOT_FOUND });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(category);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const categories = await this.categoryService.findAll();
            res.status(successCode_1.SuccessCode.OK).json(categories);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = categoryValidator_1.updateCategorySchema.parse(req.body);
            const category = await this.categoryService.update(id, data);
            res.status(successCode_1.SuccessCode.OK).json(category);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: error.issues });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await this.categoryService.delete(id);
            res.status(successCode_1.SuccessCode.NO_CONTENT).send();
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.CategoryController = CategoryController;
