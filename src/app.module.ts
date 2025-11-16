import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { UsersModule } from './users/users.module';
import { AuthRolesGuard } from './auth/auth-roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { HospitalsModule } from './hospitals/hospitals.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    UsersModule,
    HospitalsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthRolesGuard,
    },
  ],
})
export class AppModule {}
