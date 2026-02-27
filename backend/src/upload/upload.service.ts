import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as sharp from 'sharp';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class UploadService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Format non autorisé. Acceptés : JPG, PNG, WebP');
    }
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('Fichier trop volumineux. Maximum 5MB');
    }

    const optimized = await sharp(file.buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const url = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'rapking', resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        })
        .end(optimized);
    });

    return { url };
  }
}
