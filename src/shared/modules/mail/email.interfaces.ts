export interface SendEmailDto {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    from?: string;
}

export interface EmailProvider {
    sendEmail(dto: SendEmailDto): Promise<void>;
}
