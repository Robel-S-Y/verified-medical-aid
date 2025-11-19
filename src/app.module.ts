import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { UsersModule } from './users/users.module';
import { AuthRolesGuard } from './auth/auth-roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { HospitalsModule } from './hospitals/hospitals.module';
import { PatientsModule } from './patients/patients.module';
import { DonationsModule } from './donations/donations.module';
import { redisStore } from 'cache-manager-redis-store';
import { BlacklistModule } from './auth/blacklist/blacklist.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }),
        ttl: 0, // no default TTL
      }),
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
})
export class AppModule {}
