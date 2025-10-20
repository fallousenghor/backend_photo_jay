"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
const successCode_1 = require("../utils/codes/successCode");
const errorCode_1 = require("../utils/codes/errorCode");
const notificationValidator_1 = require("../validators/notificationValidator");
class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async create(req, res) {
        try {
            const data = notificationValidator_1.createNotificationSchema.parse(req.body);
            const notification = await this.notificationService.create(data);
            res.status(successCode_1.SuccessCode.CREATED).json(notification);
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
            const notification = await this.notificationService.findById(id);
            if (!notification) {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.NOTIFICATION_NOT_FOUND });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(notification);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const notifications = await this.notificationService.findAll();
            res.status(successCode_1.SuccessCode.OK).json(notifications);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = notificationValidator_1.updateNotificationSchema.parse(req.body);
            const notification = await this.notificationService.update(id, data);
            res.status(successCode_1.SuccessCode.OK).json(notification);
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
            await this.notificationService.delete(id);
            res.status(successCode_1.SuccessCode.NO_CONTENT).send();
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
