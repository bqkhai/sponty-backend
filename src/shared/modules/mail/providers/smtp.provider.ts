import * as nodemailer from 'nodemailer';
import { EmailProvider, SendEmailDto } from '../email.interfaces';

export class SmtpEmailProvider implements EmailProvider {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    async sendEmail(dto: SendEmailDto): Promise<void> {
        await this.transporter.sendMail({
            from: dto.from || process.env.EMAIL_FROM,
            to: dto.to,
            subject: dto.subject,
            html: dto.html,
            text: dto.text,
        });
    }
}
