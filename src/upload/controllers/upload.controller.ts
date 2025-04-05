/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Req, Res, Sse } from '@nestjs/common';
import { UploadService } from '../services/upload.service';
import { Request, Response } from 'express';
import * as busboy from 'busboy';
import { Readable } from 'stream';
import { Observable, Subject } from 'rxjs';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  private progressSubject = new Subject<{ data: any }>();
  @Sse('progress')
  uploadProgress(@Res() res: Response): Observable<{ data: any }> {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    return this.progressSubject.asObservable();
  }
  @Post()
  uploadFiles(@Req() req: Request, @Res() res: Response) {
    const bb = busboy({ headers: req.headers });
    const totalBytes = parseInt(req.headers['content-length'] || '0', 10);
    let uploaded = 0;
    bb.on(
      'file',
      async (fieldname: string, file, { filename, encoding, mimeType }) => {
        const passThrough = new (require('stream').PassThrough)() as Readable;
        file.pipe(passThrough);

        file.on('data', (data) => {
          uploaded += data.length;
          const progress = ((uploaded / totalBytes) * 100).toFixed(2);
          // console.log(`[${filename}] Progress: ${progress}%`);
          this.progressSubject.next({
            data: { filename, progress: Number(progress) },
          });
        });
        try {
          const url = await this.uploadService.uploadFile(
            passThrough,
            filename,
            {
              mimeType,
              encoding,
            },
          );
          this.progressSubject.next({
            data: { filename, progress: 100, done: true, url },
          });

          res.status(200).json({ url });
        } catch (err) {
          res
            .status(500)
            .json({ error: 'Upload failed', message: err.message });
        }
      },
    );

    req.pipe(bb);
  }

  @Post('presinged-url')
  getPresignedUrl(@Body() body: any) {
    return this.uploadService.getPresignedUrl(body);
  }

  @Post('multi-presinged-url')
  getMultiPresignedUrl(@Body() body: any) {
    return this.uploadService.getMultiPresignedUrl(body);
  }
}
