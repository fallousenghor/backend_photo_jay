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
    async update(id, data) {
        return this.notificationRepository.update(id, data);
    }
    async delete(id) {
        return this.notificationRepository.delete(id);
    }
}
exports.NotificationService = NotificationService;
