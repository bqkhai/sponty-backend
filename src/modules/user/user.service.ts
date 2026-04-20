import { Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RecordStatus } from '../../shared/enums/record-status';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  // 📌 dùng chung
  findOne(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  // 📌 alias cho rõ nghĩa (optional)
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return {
      ...user,
    };
  }

  // 🔑 dùng cho auth
  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  // 🔑 create user (register)
  createUser(data: Partial<User>) {
    return this.userRepository.save(data);
  }

  // 🔑 update password
  async updatePassword(userId: string, password: string) {
    await this.userRepository.update(userId, { password });
  }

  // 👤 update profile
  async updateProfile(userId: string, dto: UpdateUserDto) {
    await this.userRepository.update(userId, dto);
    return this.findOne(userId);
  }

  async updateStatus(userId: string, status: RecordStatus) {
    await this.userRepository.update(userId, { status });
  }
}
