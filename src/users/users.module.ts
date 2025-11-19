// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'models/users.models';
import { Hospital } from 'models/hospitals.models';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Patient } from 'models/patients.models';
import { Donation } from 'models/donations.models';
import { Transactions } from 'models/transactions.models';
import { BlacklistModule } from 'src/auth/blacklist/blacklist.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    BlacklistModule,
    SequelizeModule.forFeature([
      User,
      Hospital,
      Patient,
      Donation,
      Transactions,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
