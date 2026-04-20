import axios from 'axios';
import { EmailProvider, SendEmailDto } from '../email.interfaces';

export class ResendEmailProvider implements EmailProvider {
    async sendEmail(dto: SendEmailDto): Promise<void> {
        await axios.post(
            'https://api.resend.com/emails',
            {
                from: dto.from || process.env.EMAIL_FROM,
                to: Array.isArray(dto.to) ? dto.to : [dto.to],
                subject: dto.subject,
                html: dto.html,
                text: dto.text,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}
