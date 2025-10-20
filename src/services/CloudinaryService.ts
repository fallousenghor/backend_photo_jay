import cloudinary from '../config/cloudinary';
import { unlink } from 'fs/promises';

export class CloudinaryService {
    async uploadImage(file: Express.Multer.File) {
        try {
            console.log('Uploading file to Cloudinary:', {
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            });

            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
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
            await unlink(file.path);

            return {
                url: result.secure_url,
                publicId: result.public_id
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            // En cas d'erreur, on supprime quand même le fichier local
            await unlink(file.path).catch(err => 
                console.error('Error deleting temporary file:', err)
            );
            throw error;
        }
    }

    async deleteImage(publicId: string) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default new CloudinaryService();