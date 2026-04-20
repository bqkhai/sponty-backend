import { StorageProvider } from './storage.interface';
import { LocalStorageProvider } from './local.storage';

export class StorageFactory {
    static create(): StorageProvider {
        const driver = process.env.STORAGE_DRIVER || 'local';

        switch (driver) {
            case 'local':
                return new LocalStorageProvider();

            // case 's3':
            //   return new S3StorageProvider();

            default:
                throw new Error(`Unsupported storage driver: ${driver}`);
        }
    }
}
