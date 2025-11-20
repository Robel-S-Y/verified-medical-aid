import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import 'reflect-metadata';
import { UuidNotFoundPipe } from './utils/uuid-not-found.pipe';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use('api/webhooks/stripe', express.raw({ type: 'application/json' }));

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      callback(null, true);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new UuidNotFoundPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const sequelize = app.get(Sequelize);

  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log(`server is running on port ${process.env.PORT ?? 3000}`);
  });
}
void bootstrap();
