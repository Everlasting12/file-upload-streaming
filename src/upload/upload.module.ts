import { Module } from '@nestjs/common';
import { LocalUploadStrategy } from './strategies/local-upload.strategy';
import { MinIOUploadStrategy } from './strategies/minio-upload.strategy';
import { UploadStrategyFactory } from './services/upload-strategy.factory';
import { UploadService } from './services/upload.service';
import { UploadController } from './controllers/upload.controller';

@Module({
  controllers: [UploadController],
  providers: [
    LocalUploadStrategy,
    // S3UploadStrategy,
    // CloudinaryUploadStrategy,
    MinIOUploadStrategy,
    UploadStrategyFactory,
    UploadService,
  ],
  exports: [UploadService],
})
export class UploadModule {}
