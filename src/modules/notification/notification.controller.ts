import { Controller, Post, Body } from '@nestjs/common';
import { DeviceService } from './device.service';
import { FirebaseService } from './firebase/firebase.service';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('api/notification')
export class NotificationController {
    constructor(private readonly deviceService: DeviceService, private readonly firebaseService: FirebaseService) { }

    @Post('register-token')
    async register(@Body() body: any) {
        const { userId, token, platform } = body;

        await this.deviceService.registerToken(userId, token, platform);

        return { success: true };
    }

    @Public()
    @Post('test-push')
    async testPush() {
        const token = 'c8AxT0gTTKCJuAu3vWRkOM:APA91bFhj2yMbVPOfBXH9dZf1fVu_XRdeVEKBntm50xhd7f2LEqby2NVzyAeGyk4RRchv4UXrTWXUJN2j-Lwi52N7LLYRKH6eppMci5CraNJZ9TXD20DUZ8juQZlW6QJX3r6qfioaT2K';
        return this.firebaseService.sendToToken(
            // 'fake-token',
            token,
            'Hello',
            'Test push'
        );
    }
}