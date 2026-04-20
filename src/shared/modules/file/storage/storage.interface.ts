export interface UploadResult {
    path: string;
    url: string;
    filename: string;
}

export interface StorageProvider {
    upload(
        fileStream: NodeJS.ReadableStream,
        filename: string,
        mimetype: string,
    ): Promise<UploadResult>;
}
