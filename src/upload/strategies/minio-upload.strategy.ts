/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* @eslint-disable @typescript-eslint/no-unsafe-assignment */
/* @typescript-eslint/no-unsafe-call */
/* @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import { Injectable } from '@nestjs/common';
import { UploadStrategy } from '../interfaces/upload.strategy';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { UploadProvider } from '../interfaces/upload-provider.enum';

@Injectable()
export class MinIOUploadStrategy implements UploadStrategy {
  private static minioClient: Minio.Client | null = null;

  constructor() {
    this.initializeMinioClient();
  }

  private initializeMinioClient() {
    if (process.env.FILE_UPLOAD_STRATEGY !== UploadProvider.MINIO) {
      return;
    }

    const requiredEnvVars = [
      'MINIO_ENDPOINT',
      'MINIO_PORT',
      'MINIO_ROOT_USER',
      'MINIO_ROOT_PASSWORD',
      'MINIO_ACCESS_KEY',
      'MINIO_SECRET_KEY',
      'MINIO_URL_EXPIRY_IN_SECONDS',
      'MINIO_USE_SSL',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    if (!MinIOUploadStrategy.minioClient) {
      MinIOUploadStrategy.minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: parseInt(process.env.MINIO_PORT!, 10),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!,
      });
    }
  }

  async upload(stream: Readable, filename: string): Promise<string> {
    const client = MinIOUploadStrategy.minioClient!;
    if (client)
      await client.putObject(process.env.MINIO_BUCKET!, filename, stream);
    return '';
    // `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${filename}`;
  }

  getPresignedUrl(filename: string): Promise<string> {
    const client = MinIOUploadStrategy.minioClient!;
    return client.presignedPutObject(
      process.env.MINIO_BUCKET!,
      filename,
      parseInt(process.env.MINIO_URL_EXPIRY_IN_SECONDS || '300', 10),
    );
  }

  async getMultiPresignedUrl(
    filenames: string[],
  ): Promise<{ [filename: string]: string }> {
    const client = MinIOUploadStrategy.minioClient!;
    const expiry = parseInt(
      process.env.MINIO_URL_EXPIRY_IN_SECONDS || '300',
      10,
    );

    const presignedUrls: { [filename: string]: string } = {};

    for (const filename of filenames) {
      const url = await client.presignedPutObject(
        process.env.MINIO_BUCKET!,
        filename,
        expiry,
      );

      presignedUrls[filename] = url;
    }

    return presignedUrls;
  }
}
