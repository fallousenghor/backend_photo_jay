"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
const successCode_1 = require("../utils/codes/successCode");
const errorCode_1 = require("../utils/codes/errorCode");
const userValidator_1 = require("../validators/userValidator");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(req, res) {
        try {
            const data = userValidator_1.createUserSchema.parse(req.body);
            const user = await this.userService.create(data);
            res.status(successCode_1.SuccessCode.CREATED).json(user);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: error.issues });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async register(req, res) {
        try {
            const data = userValidator_1.registerSchema.parse(req.body);
            const userData = { ...data, role: 'USER' };
            const user = await this.userService.create(userData);
            res.status(successCode_1.SuccessCode.CREATED).json(user);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(errorCode_1.ErrorCode.BAD_REQUEST).json({ error: error.issues });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const data = userValidator_1.loginSchema.parse(req.body);
            const result = await this.userService.login(data.email, data.password);
            if (!result) {
                res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ error: errorMessage_1.ERROR_MESSAGES.INVALID_CREDENTIALS });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(result);
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
            const user = await this.userService.findById(id);
            if (!user) {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(user);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const users = await this.userService.findAll();
            res.status(successCode_1.SuccessCode.OK).json(users);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = userValidator_1.updateUserSchema.parse(req.body);
            const user = await this.userService.update(id, data);
            res.status(successCode_1.SuccessCode.OK).json(user);
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
            await this.userService.delete(id);
            res.status(successCode_1.SuccessCode.NO_CONTENT).send();
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
