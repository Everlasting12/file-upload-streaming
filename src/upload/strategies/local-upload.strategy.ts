import { Injectable } from '@nestjs/common';
import { UploadStrategy } from '../interfaces/upload.strategy';
import { Readable } from 'stream';
import { join } from 'path';
import * as fs from 'fs/promises';
import { createWriteStream } from 'fs';

@Injectable()
export class LocalUploadStrategy implements UploadStrategy {
  private readonly uploadDir = join(__dirname, '../../../uploads');

  async upload(stream: Readable, filename: string): Promise<string> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filePath = join(this.uploadDir, filename);
    const writeStream = createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      stream.pipe(writeStream);

      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    });
  }
}
