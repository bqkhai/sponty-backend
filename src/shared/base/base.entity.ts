import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel extends BaseEntity {
  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdDate?: Date;

  @Column({ nullable: true })
  lastModifiedBy?: string;

  @UpdateDateColumn()
  lastModifiedDate?: Date;
}
