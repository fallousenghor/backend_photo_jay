import express, { Request, Response } from 'express';
import { ModerationLogController } from '../controllers/ModerationLogController';
import { ModerationLogService } from '../services/ModerationLogService';
import { ModerationLogRepository } from '../repositories/ModerationLogRepository';
import prisma from '../config/db';

const router = express.Router();
const repository = new ModerationLogRepository(prisma);
const service = new ModerationLogService(repository);
const controller = new ModerationLogController(service);

router.get('/', (req: Request, res: Response) => controller.findAll(req, res));
router.get('/:id', (req: Request, res: Response) => controller.findById(req, res));
router.post('/', (req: Request, res: Response) => controller.create(req, res));
router.put('/:id', (req: Request, res: Response) => controller.update(req, res));
router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));

// Admin routes
router.get('/admin/recent', (req: Request, res: Response) => controller.findRecent(req, res));

export default router;
