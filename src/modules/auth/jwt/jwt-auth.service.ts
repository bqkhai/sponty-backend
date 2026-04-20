import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseMessageEnum } from '../../../shared/enums/response-message.enum';
import { UserRepository } from '../../user/repositories/user.repository';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { RecordStatus } from '../../../shared/enums/record-status';

@Injectable()
export class JwtAuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    if (typeof email !== 'string' || typeof pass !== 'string') {
      throw new HttpException(
        ResponseMessageEnum.DATA_TYPE_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new HttpException(
        ResponseMessageEnum.USER_OR_PASSWORD_INVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === RecordStatus.INACTIVE) {
      throw new HttpException(
        ResponseMessageEnum.ACCOUNT_HAS_BEEN_DELETED,
        HttpStatus.FORBIDDEN,
      );
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatch) {
      throw new HttpException(
        ResponseMessageEnum.USER_OR_PASSWORD_INVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(user: any) {
    if (user) {
      const tokens = await this.getTokens(user);
      return tokens;
    }
  }

  async getTokens(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      status: user.status,
    };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_KEY,
        expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_KEY,
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(id: string) {
    const user = await this.userService.findOne(id);
    if (!user || user.status === RecordStatus.INACTIVE) {
      throw new HttpException(
        ResponseMessageEnum.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );
    }

    return this.getTokens(user);
  }
}
