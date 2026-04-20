import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/base/base.repository';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 🔑 dùng cho login
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  // 🔑 dùng cho register
  findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
    });
  }
}
