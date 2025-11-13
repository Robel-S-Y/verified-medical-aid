import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sequelize = app.get(Sequelize);

  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server is running on port ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();
