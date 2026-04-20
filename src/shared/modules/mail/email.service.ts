import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto } from './email.interfaces';
import { EmailProviderFactory } from './email.factory';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    private primary = EmailProviderFactory.createPrimary();
    private fallback = EmailProviderFactory.createFallback();

    async send(dto: SendEmailDto): Promise<void> {
        try {
            await this.primary.sendEmail(dto);
        } catch (err) {
            this.logger.error('Primary email failed', err);

            if (this.fallback) {
                this.logger.warn('Trying fallback provider...');
                await this.fallback.sendEmail(dto);
            } else {
                throw err;
            }
        }
    }
}
