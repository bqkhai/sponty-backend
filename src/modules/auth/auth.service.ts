import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { RecordStatus } from '../../shared/enums/record-status';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private jwtAuthService: JwtAuthService,
  ) { }

  genarateToken(payload) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  decodeToken(jwt) {
    return this.jwtService.decode(jwt);
  }

  async decodeTokenWithUser(jwt) {
    const payload: any = this.decodeToken(jwt);
    if (payload?.id) {
      return await this.userService.findOne(payload.id);
    }
    return null;
  }

  async getUser(payload) {
    return await this.userService.findOne(payload.id);
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password not match');
    }

    const existed = await this.userService.findByEmail(dto.email);
    if (existed) {
      throw new BadRequestException('Email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 12);

    const user = await this.userService.createUser({
      fullName: dto.fullName,
      email: dto.email,
      password: hash,
      createdBy: 'system',
      lastModifiedBy: 'system',
    });

    return this.jwtAuthService.getTokens(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userService.findOne(userId);

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);

    await this.userService.updatePassword(userId, newHash);

    return { message: 'Password changed successfully' };
  }

  async deleteProfile(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.updateStatus(userId, RecordStatus.INACTIVE);

    return {
      message: 'Account has been delete.',
    };
  }
}
