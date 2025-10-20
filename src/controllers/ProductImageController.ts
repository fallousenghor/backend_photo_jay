import { Request, Response } from 'express';
import { ZodError, z } from 'zod';
import { ProductImageService } from '../services/ProductImageService';
import type { CreateProductImage, UpdateProductImage } from '../types/ProductImage';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { SuccessCode } from '../utils/codes/successCode';
import { ErrorCode } from '../utils/codes/errorCode';
import { createProductImageSchema, updateProductImageSchema } from '../validators/productImageValidator';
import multer from 'multer';
import path from 'path';
import os from 'os';
import cloudinaryService from '../services/CloudinaryService';

// Configuration de multer avec des vérifications supplémentaires
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Utiliser le répertoire temporaire du système
    const uploadPath = os.tmpdir();
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, safeFilename);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accepter uniquement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  }
});

export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}

  async create(req: Request & { file?: Express.Multer.File }, res: Response): Promise<void> {
    try {
      const productId = z.coerce.number().int().positive().parse(req.body.productId);
      if (!req.file) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: 'Image file is required' });
        return;
      }

      console.log('Starting image upload process...');
      
      // Upload to Cloudinary
      const cloudinaryResult = await cloudinaryService.uploadImage(req.file);
      console.log('Cloudinary upload result:', cloudinaryResult);
      
      const data = { 
        productId, 
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId 
      };
      console.log('Preparing to save image data:', data);
      
      const productImage = await this.productImageService.create(data);
      console.log('Image saved to database:', productImage);
      
      res.status(SuccessCode.CREATED).json(productImage);
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
      const productImage = await this.productImageService.findById(id);
      if (!productImage) {
        res.status(ErrorCode.NOT_FOUND).json({ error: ERROR_MESSAGES.PRODUCT_IMAGE_NOT_FOUND });
        return;
      }
      res.status(SuccessCode.OK).json(productImage);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const productImages = await this.productImageService.findAll();
      res.status(SuccessCode.OK).json(productImages);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = updateProductImageSchema.parse(req.body);
      const productImage = await this.productImageService.update(id, data);
      res.status(SuccessCode.OK).json(productImage);
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
      await this.productImageService.delete(id);
      res.status(SuccessCode.NO_CONTENT).send();
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }
}
