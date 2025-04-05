import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocalUploadStrategy } from '../strategies/local-upload.strategy';
import { MinIOUploadStrategy } from '../strategies/minio-upload.strategy';
import { UploadProvider } from '../interfaces/upload-provider.enum';
import { UploadStrategy } from '../interfaces/upload.strategy';

@Injectable()
export class UploadStrategyFactory {
  constructor(
    private readonly local: LocalUploadStrategy,
    // private readonly s3: S3UploadStrategy,
    private readonly minio: MinIOUploadStrategy,
    // private readonly cloudinary: CloudinaryUploadStrategy,
  ) {}

  getStrategy(provider: UploadProvider): UploadStrategy {
    switch (provider) {
      case UploadProvider.LOCAL:
        return this.local;
      //   case UploadProvider.S3:
      //     return this.s3;
      case UploadProvider.MINIO:
        return this.minio;
      //   case UploadProvider.CLOUDINARY:
      //     return this.cloudinary;
      default:
        throw new InternalServerErrorException('Unknown upload provider');
    }
  }
}
