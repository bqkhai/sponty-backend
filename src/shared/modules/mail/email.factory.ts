import { EmailProvider } from './email.interfaces';
import { SmtpEmailProvider } from './providers/smtp.provider';
import { ResendEmailProvider } from './providers/resend.provider';

export class EmailProviderFactory {
    static createPrimary(): EmailProvider {
        switch (process.env.EMAIL_PROVIDER) {
            case 'smtp':
                return new SmtpEmailProvider();
            case 'resend':
                return new ResendEmailProvider();
            default:
                throw new Error('Invalid EMAIL_PROVIDER');
        }
    }

    static createFallback(): EmailProvider | null {
        switch (process.env.EMAIL_FALLBACK) {
            case 'smtp':
                return new SmtpEmailProvider();
            case 'resend':
                return new ResendEmailProvider();
            default:
                return null;
        }
    }
}
