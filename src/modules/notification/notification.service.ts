import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DeviceService } from './device.service';

@Injectable()
export class NotificationService {
    constructor(
        @InjectQueue('notification')
        private queue: Queue,
        private deviceService: DeviceService,
    ) { }

    // send single user
    async sendToUser(userId: number, title: string, body: string) {
        const tokens = await this.deviceService.getTokensByUserIds([userId]);

        return this.enqueue(tokens, title, body);
    }

    // send multiple user
    async sendToUsers(userIds: number[], title: string, body: string) {
        const tokens = await this.deviceService.getTokensByUserIds(userIds);

        return this.enqueue(tokens, title, body);
    }

    // core enqueue
    private async enqueue(tokens: string[], title: string, body: string) {
        const chunkSize = 100;

        for (let i = 0; i < tokens.length; i += chunkSize) {
            const chunk = tokens.slice(i, i + chunkSize);

            await this.queue.add(
                'send-multi',
                { tokens: chunk, title, body },
                {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: true,
                },
            );
        }
    }
}
