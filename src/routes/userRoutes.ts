import express from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { Role } from '../types/enums';

const router = express.Router();
const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));

router.get('/', authenticate, authorize(Role.ADMIN), controller.findAll.bind(controller));
router.get('/:id', authenticate, controller.findById.bind(controller));
router.post('/', authenticate, authorize(Role.ADMIN), controller.create.bind(controller));
router.put('/:id', authenticate, authorize(Role.ADMIN), controller.update.bind(controller));
router.delete('/:id', authenticate, authorize(Role.ADMIN), controller.delete.bind(controller));

export default router;
