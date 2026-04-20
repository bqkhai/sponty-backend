import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FirebaseService } from './firebase/firebase.service';
import { DeviceService } from './device.service';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
    constructor(
        private firebase: FirebaseService,
        private deviceService: DeviceService,
    ) {
        super();
    }

    async process(job: Job) {
        switch (job.name) {
            case 'send-multi':
                return this.handleMulti(job);
        }
    }

    private async handleMulti(job: Job) {
        const { tokens, title, body } = job.data;

        const res = await this.firebase.sendMulticast(tokens, title, body);

        res.responses.forEach((r, idx) => {
            if (!r.success) {
                const error = r.error as any;

                if (
                    error?.errorInfo?.code ===
                    'messaging/registration-token-not-registered'
                ) {
                    this.deviceService.removeToken(tokens[idx]);
                }
            }
        });
    }
}
