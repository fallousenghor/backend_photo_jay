"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationLogService = void 0;
class ModerationLogService {
    constructor(moderationLogRepository) {
        this.moderationLogRepository = moderationLogRepository;
    }
    async create(data) {
        return this.moderationLogRepository.create(data);
    }
    async findById(id) {
        return this.moderationLogRepository.findById(id);
    }
    async findAll() {
        return this.moderationLogRepository.findAll();
    }
    async findRecent(limit = 10) {
        return this.moderationLogRepository.findRecent(limit);
    }
    async update(id, data) {
        return this.moderationLogRepository.update(id, data);
    }
    async delete(id) {
        return this.moderationLogRepository.delete(id);
    }
}
exports.ModerationLogService = ModerationLogService;
