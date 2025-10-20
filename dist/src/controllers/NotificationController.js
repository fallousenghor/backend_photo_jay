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
            // Get user ID from auth middleware (assuming it's set)
            const userId = req.user?.id;
            if (!userId) {
                res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            const notifications = await this.notificationService.findByUserId(userId);
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
    async markAsRead(req, res) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user?.id;
            if (!userId) {
                res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            const notification = await this.notificationService.markAsRead(id, userId);
            res.status(successCode_1.SuccessCode.OK).json(notification);
        }
        catch (error) {
            if (error.message === 'Notification not found or access denied') {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            await this.notificationService.markAllAsRead(userId);
            res.status(successCode_1.SuccessCode.OK).json({ message: 'Toutes les notifications ont été marquées comme lues' });
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async getUnreadCount(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(errorCode_1.ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
                return;
            }
            const count = await this.notificationService.getUnreadCount(userId);
            res.status(successCode_1.SuccessCode.OK).json({ count });
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
