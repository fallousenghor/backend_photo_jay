import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ProductService } from '../services/ProductService';
import type { CreateProduct, UpdateProduct } from '../types/Product';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { SuccessCode } from '../utils/codes/successCode';
import { ErrorCode } from '../utils/codes/errorCode';
import { createProductSchema, updateProductSchema } from '../validators/productValidator';

export class ProductController {
  constructor(private productService: ProductService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsedData = createProductSchema.parse(req.body);
      const data: CreateProduct = {
        ...parsedData,
        expiresAt: parsedData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };
      const product = await this.productService.create(data);
      res.status(SuccessCode.CREATED).json(product);
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
      const product = await this.productService.findById(id);
      if (!product) {
        res.status(ErrorCode.NOT_FOUND).json({ error: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        return;
      }
      res.status(SuccessCode.OK).json(product);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, status, ownerId } = req.query;
      const products = await this.productService.findAll(
        categoryId ? parseInt(categoryId as string) : undefined,
        status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined,
        ownerId ? parseInt(ownerId as string) : undefined
      );
      res.status(SuccessCode.OK).json(products);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = updateProductSchema.parse(req.body);
      const product = await this.productService.update(id, data);
      res.status(SuccessCode.OK).json(product);
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
      await this.productService.delete(id);
      res.status(SuccessCode.NO_CONTENT).send();
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }
}
