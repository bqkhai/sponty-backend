import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);

    onModuleInit() {
        if (admin.apps.length > 0) {
            this.logger.log('Firebase already initialized');
            return;
        }

        const serviceAccount = require(path.join(
            process.cwd(),
            'src/config/firebase/firebase.service-account.json',
        ));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        this.logger.log('Firebase initialized');
    }

    // =========================
    // 1. SEND SINGLE TOKEN
    // =========================
    async sendToToken(
        token: string,
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        try {
            const res = await admin.messaging().send({
                token,
                notification: {
                    title,
                    body,
                },
                data: this.normalizeData(data),
            });

            return {
                success: true,
                messageId: res,
            };
        } catch (error: any) {
            this.handleError(error, token);
            throw error;
        }
    }

    // =========================
    // 2. SEND MULTIPLE TOKENS
    // =========================
    async sendMulticast(
        tokens: string[],
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        if (!tokens?.length) {
            return { successCount: 0, failureCount: 0, responses: [] };
        }

        try {
            const res = await admin.messaging().sendEachForMulticast({
                tokens,
                notification: { title, body },
                data: this.normalizeData(data),
            });

            return res;
        } catch (error) {
            this.logger.error('Multicast send failed', error);
            throw error;
        }
    }

    // =========================
    // 3. SEND TO TOPIC
    // =========================
    async sendToTopic(
        topic: string,
        title: string,
        body: string,
        data?: Record<string, string>,
    ) {
        try {
            return await admin.messaging().send({
                topic,
                notification: { title, body },
                data: this.normalizeData(data),
            });
        } catch (error) {
            this.logger.error(`Send to topic failed: ${topic}`, error);
            throw error;
        }
    }

    // =========================
    // 4. SUBSCRIBE TOKEN TO TOPIC
    // =========================
    async subscribeToTopic(tokens: string[], topic: string) {
        try {
            return await admin.messaging().subscribeToTopic(tokens, topic);
        } catch (error) {
            this.logger.error('Subscribe topic failed', error);
            throw error;
        }
    }

    // =========================
    // 5. UNSUBSCRIBE
    // =========================
    async unsubscribeFromTopic(tokens: string[], topic: string) {
        try {
            return await admin.messaging().unsubscribeFromTopic(tokens, topic);
        } catch (error) {
            this.logger.error('Unsubscribe topic failed', error);
            throw error;
        }
    }

    // =========================
    // 6. CLEAN DATA (FCM yêu cầu string)
    // =========================
    private normalizeData(data?: Record<string, any>) {
        if (!data) return {};

        const result: Record<string, string> = {};

        Object.keys(data).forEach((key) => {
            result[key] = String(data[key]);
        });

        return result;
    }

    // =========================
    // 7. ERROR HANDLER
    // =========================
    private handleError(error: any, token?: string) {
        const code = error?.errorInfo?.code;

        switch (code) {
            case 'messaging/registration-token-not-registered':
                this.logger.warn(`Invalid token: ${token}`);
                break;

            case 'messaging/invalid-argument':
                this.logger.warn('Invalid payload');
                break;

            case 'messaging/message-rate-exceeded':
                this.logger.warn('Rate limit exceeded');
                break;

            default:
                this.logger.error('Firebase error', error);
        }
    }
}
