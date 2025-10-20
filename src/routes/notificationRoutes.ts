import express from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationService } from '../services/NotificationService';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();
const repository = new NotificationRepository();
const service = new NotificationService(repository);
const controller = new NotificationController(service);

router.get('/', authenticate, (req, res) => controller.findAll(req, res));
router.get('/:id', authenticate, (req, res) => controller.findById(req, res));
router.post('/', authenticate, (req, res) => controller.create(req, res));
router.put('/:id', authenticate, (req, res) => controller.update(req, res));
router.put('/:id/read', authenticate, (req, res) => controller.markAsRead(req, res));
router.put('/mark-all-read', authenticate, (req, res) => controller.markAllAsRead(req, res));
router.get('/unread-count', authenticate, (req, res) => controller.getUnreadCount(req, res));
router.delete('/:id', authenticate, (req, res) => controller.delete(req, res));

export default router;
