import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DeviceEntity } from './entities/device.entity';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(DeviceEntity)
        private repo: Repository<DeviceEntity>,
    ) { }

    async registerToken(userId: number, token: string, platform?: string) {
        const existing = await this.repo.findOne({ where: { token } });

        if (existing) {
            existing.user_id = userId;
            existing.platform = platform;
            return this.repo.save(existing);
        }

        return this.repo.save({
            user_id: userId,
            token,
            platform,
        });
    }

    async getTokensByUserIds(userIds: number[]) {
        const devices = await this.repo.find({
            where: {
                user_id: In(userIds),
            },
        });

        return devices.map((d) => d.token);
    }

    async removeToken(token: string) {
        await this.repo.delete({ token });
    }
}
