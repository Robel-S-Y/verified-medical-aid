import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { UsersModule } from './users/users.module';
import { AuthRolesGuard } from './auth/auth-roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { HospitalsModule } from './hospitals/hospitals.module';
import { PatientsModule } from './patients/patients.module';
import { DonationsModule } from './donations/donations.module';
import { BlacklistModule } from './auth/blacklist/blacklist.module';
import { RedisModule } from './redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'uploads'),
      serveRoot: '/uploads',
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      synchronize: process.env.NODE_ENV === 'dev',
    }),
    UsersModule,
    HospitalsModule,
    PatientsModule,
    DonationsModule,
    BlacklistModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthRolesGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
