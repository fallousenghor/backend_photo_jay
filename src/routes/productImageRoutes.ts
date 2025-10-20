import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { ProductImageController } from '../controllers/ProductImageController';
import { ProductImageService } from '../services/ProductImageService';
import { ProductImageRepository } from '../repositories/ProductImageRepository';

const router = express.Router();
const repository = new ProductImageRepository();
const service = new ProductImageService(repository);
const controller = new ProductImageController(service);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Utiliser le répertoire temporaire du système pour le stockage temporaire
    cb(null, path.join(os.tmpdir()));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', upload.single('image'), (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
