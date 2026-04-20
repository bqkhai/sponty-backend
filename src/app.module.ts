import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthModule } from './modules/auth/jwt/jwt-auth.module';
import { FileModule } from './shared/modules/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guards/access-token.guard';
import { EmailModule } from './shared/modules/mail/email.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from './modules/notification/notification.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    DatabaseModule,

    // Shared module
    EmailModule,
    FileModule,

    // Business module
    NotificationModule,
    AuthModule,
    JwtAuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule { }
