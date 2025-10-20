"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const promises_1 = require("fs/promises");
class CloudinaryService {
    async uploadImage(file) {
        try {
            console.log('Uploading file to Cloudinary:', {
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            });
            // Upload the image to Cloudinary
            const result = await cloudinary_1.default.uploader.upload(file.path, {
                folder: 'photoljay',
                use_filename: true,
                unique_filename: true,
                resource_type: 'auto'
            });
            console.log('Cloudinary upload success:', {
                url: result.secure_url,
                publicId: result.public_id
            });
            // Supprimer le fichier local après l'upload
            await (0, promises_1.unlink)(file.path);
            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        }
        catch (error) {
            console.error('Cloudinary upload error:', error);
            // En cas d'erreur, on supprime quand même le fichier local
            await (0, promises_1.unlink)(file.path).catch(err => console.error('Error deleting temporary file:', err));
            throw error;
        }
    }
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.default.uploader.destroy(publicId);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CloudinaryService = CloudinaryService;
exports.default = new CloudinaryService();
