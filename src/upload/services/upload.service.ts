import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { retryWithBackoff } from '../utils/retry.util';
import { UploadProvider } from '../interfaces/upload-provider.enum';
import { UploadStrategyFactory } from './upload-strategy.factory';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  constructor(private readonly factory: UploadStrategyFactory) {}

  async uploadFile(
    stream: Readable,
    filename: string,
    metadata?: Record<string, any>,
  ): Promise<string> {
    const strategy = this.factory.getStrategy(
      process.env.FILE_UPLOAD_STRATEGY! as UploadProvider,
    );
    return retryWithBackoff(
      async () => {
        this.logger.log(`Attempting upload: ${filename}`);
        return await strategy.upload(stream, filename, metadata);
      },
      3,
      1000,
    );
  }

  getPresignedUrl(body: { filename: string }) {
    const strategy = this.factory.getStrategy(
      process.env.FILE_UPLOAD_STRATEGY! as UploadProvider,
    );
    return retryWithBackoff(
      async () => {
        this.logger.log(`Attempting upload: ${body.filename}`);
        if (strategy.getPresignedUrl) {
          return await strategy.getPresignedUrl(body.filename);
        }
      },
      3,
      1000,
    );
  }
  getMultiPresignedUrl(body: { filenames: string[] }) {
    const strategy = this.factory.getStrategy(
      process.env.FILE_UPLOAD_STRATEGY! as UploadProvider,
    );
    return retryWithBackoff(
      async () => {
        this.logger.log(`Attempting upload: ${body.filenames.join(',')}`);
        if (strategy.getMultiPresignedUrl) {
          return await strategy.getMultiPresignedUrl(body.filenames);
        }
      },
      3,
      1000,
    );
  }
}
