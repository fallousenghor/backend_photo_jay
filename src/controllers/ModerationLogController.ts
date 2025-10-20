import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ModerationLogService } from '../services/ModerationLogService';
import type { CreateModerationLog, UpdateModerationLog } from '../types/ModerationLog';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { SuccessCode } from '../utils/codes/successCode';
import { ErrorCode } from '../utils/codes/errorCode';
import { createModerationLogSchema, updateModerationLogSchema } from '../validators/moderationLogValidator';

export class ModerationLogController {
  constructor(private moderationLogService: ModerationLogService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createModerationLogSchema.parse(req.body);
      const moderationLog = await this.moderationLogService.create(data);
      res.status(SuccessCode.CREATED).json(moderationLog);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: error.issues });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const moderationLog = await this.moderationLogService.findById(id);
      if (!moderationLog) {
        res.status(ErrorCode.NOT_FOUND).json({ error: ERROR_MESSAGES.MODERATION_LOG_NOT_FOUND });
        return;
      }
      res.status(SuccessCode.OK).json(moderationLog);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const moderationLogs = await this.moderationLogService.findAll();
      res.status(SuccessCode.OK).json(moderationLogs);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findRecent(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const moderationLogs = await this.moderationLogService.findRecent(limit);
      res.status(SuccessCode.OK).json(moderationLogs);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = updateModerationLogSchema.parse(req.body);
      const moderationLog = await this.moderationLogService.update(id, data);
      res.status(SuccessCode.OK).json(moderationLog);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: error.issues });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.moderationLogService.delete(id);
      res.status(SuccessCode.NO_CONTENT).send();
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }
}
