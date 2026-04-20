import { Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FileService } from './file.service';

@Controller('api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  async upload(@Req() req: FastifyRequest) {
    return this.fileService.handleUpload(req);
  }
}
