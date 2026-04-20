import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_devices')
export class DeviceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ unique: true })
    token: string;

    @Column({ nullable: true })
    platform: string;
}
