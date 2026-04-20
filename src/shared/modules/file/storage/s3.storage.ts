import { StorageProvider, UploadResult } from './storage.interface';

export class S3StorageProvider implements StorageProvider {
    async upload(
        fileStream: NodeJS.ReadableStream,
        filename: string,
        mimetype: string,
    ): Promise<UploadResult> {
        // TODO: upload to S3
        return {
            filename,
            path: 's3/path',
            url: 'https://cdn.xxx.com/s3/path',
        };
    }
}
