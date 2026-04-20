import { StorageProvider, UploadResult } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';

export class LocalStorageProvider implements StorageProvider {
    private getUploadPath(): string {
        const now = new Date();

        const uploadPath = path.join(
            process.cwd(),
            'uploads',
            `${now.getFullYear()}`,
            `${now.getMonth() + 1}`,
            `${now.getDate()}`,
        );

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        return uploadPath;
    }

    async upload(
        fileStream: NodeJS.ReadableStream,
        filename: string,
        mimetype: string,
    ): Promise<UploadResult> {
        const uploadDir = this.getUploadPath();

        const ext = path.extname(filename);
        const newFilename = `${Date.now()}-${Math.random()}${ext}`;

        const fullPath = path.join(uploadDir, newFilename);

        await new Promise<void>((resolve, reject) => {
            const writeStream = fs.createWriteStream(fullPath);
            fileStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        const relativePath = path
            .relative(process.cwd(), fullPath)
            .replace(/\\/g, '/');

        return {
            filename: newFilename,
            path: relativePath,
            url: `/${relativePath}`,
        };
    }
}
