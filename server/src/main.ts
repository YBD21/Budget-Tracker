import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import slowDown from 'express-slow-down';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import Express adapter

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');

  // Explicitly cast as NestExpressApplication to access Express-specific methods
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT') ?? '5000');

  const clientPort =
    configService.get('CLIENT_PORT') ?? 'http://localhost:3000';

  console.log(clientPort);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const speedLimiter = slowDown({
    windowMs: 30 * 60 * 1000, // 30 minutes
    delayAfter: 25, // allow 10 requests per 30 minutes, then...
    delayMs: 500, // begin adding 5ms of delay per request above 10:
  });

  app.use(speedLimiter);
  // Enable CORS for all origins and allow credentials
  app.enableCors({
    origin: clientPort,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // maxAge: 600,
    credentials: true,
  });

  // Set 'trust proxy' on the underlying Express instance
  // app.getHttpAdapter().getInstance().set('trust proxy', 1);

  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
