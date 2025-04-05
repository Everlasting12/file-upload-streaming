import { Readable } from 'stream';

export interface UploadStrategy {
  upload(
    stream: Readable,
    filename: string,
    metadata?: Record<string, any>,
  ): Promise<string>;

  getPresignedUrl?(
    filename: string,
    metadata?: Record<string, any>,
  ): Promise<string>;

  getMultiPresignedUrl?(
    filenames: string[],
    metadata?: Record<string, any>,
  ): Promise<{ [filename: string]: string }>;
}
