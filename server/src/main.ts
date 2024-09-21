import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
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

  // Enable CORS for all origins and allow credentials
  app.enableCors({
    origin: clientPort,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    preflightContinue: true,
    maxAge: 600,
    credentials: true,
  });

  // Set 'trust proxy' on the underlying Express instance
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
