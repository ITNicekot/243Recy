import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('presign')
  async presign(@Body() body: { fileName: string; fileType: string }) {
    const url = await this.uploadService.generatePresignedUrl(body.fileName, body.fileType);
    return { url };
  }
}