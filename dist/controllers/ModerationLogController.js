"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationLogController = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
const successCode_1 = require("../utils/codes/successCode");
const errorCode_1 = require("../utils/codes/errorCode");
const moderationLogValidator_1 = require("../validators/moderationLogValidator");
class ModerationLogController {
    constructor(moderationLogService) {
        this.moderationLogService = moderationLogService;
    }
    async create(req, res) {
        try {
            const data = moderationLogValidator_1.createModerationLogSchema.parse(req.body);
            const moderationLog = await this.moderationLogService.create(data);
            res.status(successCode_1.SuccessCode.CREATED).json(moderationLog);
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
            const moderationLog = await this.moderationLogService.findById(id);
            if (!moderationLog) {
                res.status(errorCode_1.ErrorCode.NOT_FOUND).json({ error: errorMessage_1.ERROR_MESSAGES.MODERATION_LOG_NOT_FOUND });
                return;
            }
            res.status(successCode_1.SuccessCode.OK).json(moderationLog);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const moderationLogs = await this.moderationLogService.findAll();
            res.status(successCode_1.SuccessCode.OK).json(moderationLogs);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async findRecent(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const moderationLogs = await this.moderationLogService.findRecent(limit);
            res.status(successCode_1.SuccessCode.OK).json(moderationLogs);
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = moderationLogValidator_1.updateModerationLogSchema.parse(req.body);
            const moderationLog = await this.moderationLogService.update(id, data);
            res.status(successCode_1.SuccessCode.OK).json(moderationLog);
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
            await this.moderationLogService.delete(id);
            res.status(successCode_1.SuccessCode.NO_CONTENT).send();
        }
        catch (error) {
            res.status(errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
exports.ModerationLogController = ModerationLogController;
