"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async create(data) {
        return this.notificationRepository.create(data);
    }
    async findById(id) {
        return this.notificationRepository.findById(id);
    }
    async findAll() {
        return this.notificationRepository.findAll();
    }
    async findByUserId(userId) {
        return this.notificationRepository.findByUserId(userId);
    }
    async markAsRead(notificationId, userId) {
        // First check if the notification belongs to the user
        const notification = await this.notificationRepository.findById(notificationId);
        if (!notification || notification.userId !== userId) {
            throw new Error('Notification not found or access denied');
        }
        return this.notificationRepository.update(notificationId, { isRead: true });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.markAllAsRead(userId);
    }
    async getUnreadCount(userId) {
        return this.notificationRepository.getUnreadCount(userId);
    }
    async update(id, data) {
        return this.notificationRepository.update(id, data);
    }
    async delete(id) {
        return this.notificationRepository.delete(id);
    }
}
exports.NotificationService = NotificationService;
