import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import * as path from 'path';
import fastifyMultipart from '@fastify/multipart';
import { contentParser } from 'fastify-multer';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { TimmingRequestInterceptor } from './shared/intercepters/logging';
import { ResponseMessageExceptionFilter } from './shared/filters/response-message-exception';

async function bootstrap() {
  // create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 30 * 1024 * 1024, // Giới hạn kích thước file (30MB)
      files: 10,
    },
  });

  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  // cors
  // app.enableCors();
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    credentials: true,
  });

  // global interceptors
  app.useGlobalInterceptors(new TimmingRequestInterceptor());
  // global filters
  app.useGlobalFilters(new ResponseMessageExceptionFilter());
  // global pipes
  app.useGlobalPipes(new ValidationPipe());
  // swagger
  setupSwagger(app, 'v1.0');
  // log
  await app.register(morgan('tiny'));
  // security
  // await app.register(helmet);
  await app.listen(8081, '0.0.0.0');
}

bootstrap();
