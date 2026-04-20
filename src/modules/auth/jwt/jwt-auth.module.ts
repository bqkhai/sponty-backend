import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategies/jwt-access.strategy';
import { JwtAuthService } from './jwt-auth.service';
import { LocalStrategy } from '../local.strategy';
import { UserRepository } from '../../user/repositories/user.repository';
import { DatabaseModule } from '../../../database/database.module';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME },
    }),
    UserModule,
  ],
  providers: [
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtAuthService,
    LocalStrategy,
    UserRepository,
  ],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
