import { Injectable } from '@nestjs/common';
import { User } from './modules/user/entities/user.entity';
import { UserService } from './modules/user/user.service';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthService } from './modules/auth/jwt/jwt-auth.service';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private authService: JwtAuthService,
    // private redisService: DBRedisService,
  ) {}

  async init(data): Promise<any> {
    let user = new User();
    user.fullName = data.user_name;
    user = await this.userService.saveRecord(user);
    return this.authService.getTokens(user);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
