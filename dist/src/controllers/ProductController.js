"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
const successCode_1 = require("../utils/codes/successCode");
const errorCode_1 = require("../utils/codes/errorCode");
const productValidator_1 = require("../validators/productValidator");
class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async create(req, res) {
        try {
            const parsedData = productValidator_1.createProductSchema.parse(req.body);
            const data = {
                ...parsedData,
                expiresAt: parsedData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            };
            const product = await this.productService.create(data);
            res.status(successCode_1.SuccessCode.CREATED).json(product);
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
            const product = await this.productService.findById(id);
            if (!product) {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(product);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const { categoryId, status, ownerId } = req.query;
            const products = await this.productService.findAll(categoryId ? parseInt(categoryId) : undefined, status, ownerId ? parseInt(ownerId) : undefined);
            res.status(successCode_1.SuccessCode.OK).json(products);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = productValidator_1.updateProductSchema.parse(req.body);
            const product = await this.productService.update(id, data);
            res.status(successCode_1.SuccessCode.OK).json(product);
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
            await this.productService.delete(id);
            res.status(successCode_1.SuccessCode.NO_CONTENT).send();
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.ProductController = ProductController;
