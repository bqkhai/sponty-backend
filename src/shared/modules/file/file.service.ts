import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { StorageFactory } from './storage/storage.factory';

@Injectable()
export class FileService {
  private storage = StorageFactory.create();

  private buildFileUrl(req: FastifyRequest, path: string) {
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    return `${baseUrl}/${path}`;
  }

  async handleUpload(req: FastifyRequest) {
    const parts = req.parts();
    const results = [];

    for await (const part of parts) {
      if (part.type === 'file') {
        const filePart = part as MultipartFile;

        const result = await this.storage.upload(
          filePart.file,
          filePart.filename,
          filePart.mimetype,
        );

        results.push({
          originalName: filePart.filename,
          filename: result.filename,
          path: result.path,
          url: this.buildFileUrl(req, result.path),
          mimetype: filePart.mimetype,
        });
      }
    }

    return {
      success: true,
      message: 'Upload successful',
      data: results,
    };
  }
}
