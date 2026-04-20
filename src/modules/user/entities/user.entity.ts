import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../../shared/base/base.entity';
import { RecordStatus } from '../../../shared/enums/record-status';

@Entity('users')
export class User extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ type: 'enum', enum: RecordStatus, default: RecordStatus.ACTIVE })
  status: RecordStatus;
}
