import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { UserService } from '../services/UserService';
import type { CreateUser, UpdateUser } from '../types/User';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { SuccessCode } from '../utils/codes/successCode';
import { ErrorCode } from '../utils/codes/errorCode';
import { createUserSchema, updateUserSchema, registerSchema, loginSchema } from '../validators/userValidator';

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await this.userService.create(data);
      res.status(SuccessCode.CREATED).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: error.issues });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      const userData = { ...data, role: 'USER' as const };
      const user = await this.userService.create(userData);
      res.status(SuccessCode.CREATED).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: error.issues });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.userService.login(data.email, data.password);
      if (!result) {
        res.status(ErrorCode.UNAUTHORIZED).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
        return;
      }
      res.status(SuccessCode.OK).json(result);
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
      const user = await this.userService.findById(id);
      if (!user) {
        res.status(ErrorCode.NOT_FOUND).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        return;
      }
      res.status(SuccessCode.OK).json(user);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();
      res.status(SuccessCode.OK).json(users);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = updateUserSchema.parse(req.body);
      const user = await this.userService.update(id, data);
      res.status(SuccessCode.OK).json(user);
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
      await this.userService.delete(id);
      res.status(SuccessCode.NO_CONTENT).send();
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }
}
