import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { CategoryService } from '../services/CategoryService';
import type { CreateCategory, UpdateCategory } from '../types/Category';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { SuccessCode } from '../utils/codes/successCode';
import { ErrorCode } from '../utils/codes/errorCode';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createCategorySchema.parse(req.body);
      const category = await this.categoryService.create(data);
      res.status(SuccessCode.CREATED).json(category);
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
      const category = await this.categoryService.findById(id);
      if (!category) {
        res.status(ErrorCode.NOT_FOUND).json({ error: ERROR_MESSAGES.CATEGORY_NOT_FOUND });
        return;
      }
      res.status(SuccessCode.OK).json(category);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.findAll();
      res.status(SuccessCode.OK).json(categories);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = updateCategorySchema.parse(req.body);
      const category = await this.categoryService.update(id, data);
      res.status(SuccessCode.OK).json(category);
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
      await this.categoryService.delete(id);
      res.status(SuccessCode.NO_CONTENT).send();
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }
}
