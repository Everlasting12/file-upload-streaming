// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { BadRequestException, Injectable } from '@nestjs/common';
// import * as NodeClam from 'clamscan';
// import { randomUUID } from 'crypto';
// import { createWriteStream } from 'fs';
// import { tmpdir } from 'os';
// import { join } from 'path';
// import { pipeline, Readable } from 'stream';

// @Injectable()
// export class VirusScanService {
//   private clam: NodeClam;

//   constructor() {
//     this.initClam();
//   }

//   private initClam() {
//     const clamscan = new NodeClam().init({
//       removeInfected: false,
//       quarantineInfected: false,
//       scanLog: '',
//       debugMode: false,
//       fileList: '',
//       scanRecursively: false,
//       clamdscan: {
//         socket: false,
//         host: '127.0.0.1',
//         port: 3310,
//         timeout: 60000,
//         localFallback: true,
//       },
//       preference: 'clamdscan',
//     });

//     this.clam = clamscan;
//   }

//   async scanStream(stream: Readable): Promise<void> {
//     const tempPath = join(tmpdir(), `${randomUUID()}`);
//     const tempWrite = createWriteStream(tempPath);

//     // Save stream to disk temporarily for scanning
//     await pipeline(stream, tempWrite);

//     const { isInfected, viruses } = await this.clam.isInfected(tempPath);

//     if (isInfected) {
//       throw new BadRequestException(
//         `Virus detected: ${viruses?.join(', ') || 'unknown'}`,
//       );
//     }
//   }
// }
