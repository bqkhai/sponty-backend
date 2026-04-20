import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { FirebaseService } from './firebase/firebase.service';
import { NotificationController } from './notification.controller';
import { DeviceEntity } from './entities/device.entity';
import { DeviceService } from './device.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notification',
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([DeviceEntity]),
    ],
    providers: [
        NotificationService,
        NotificationProcessor,
        FirebaseService,
        DeviceService,
    ],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule { }
