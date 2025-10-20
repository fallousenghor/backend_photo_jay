"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class NotificationRepository {
    async create(data) {
        const prismaData = {
            user: { connect: { id: data.userId } },
            type: data.type,
            message: data.message,
            isRead: data.isRead ?? false,
            createdAt: new Date(),
        };
        return db_1.default.notification.create({ data: prismaData });
    }
    async findById(id) {
        return db_1.default.notification.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.notification.findMany();
    }
    async findByUserId(userId) {
        return db_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async markAllAsRead(userId) {
        await db_1.default.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: { isRead: true }
        });
    }
    async getUnreadCount(userId) {
        return db_1.default.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
    }
    async update(id, data) {
        const prismaData = {};
        if (data.userId !== undefined)
            prismaData.user = { connect: { id: data.userId } };
        if (data.type !== undefined)
            prismaData.type = data.type;
        if (data.message !== undefined)
            prismaData.message = data.message;
        if (data.isRead !== undefined)
            prismaData.isRead = data.isRead;
        return db_1.default.notification.update({ where: { id }, data: prismaData });
    }
    async delete(id) {
        await db_1.default.notification.delete({ where: { id } });
    }
}
exports.NotificationRepository = NotificationRepository;
