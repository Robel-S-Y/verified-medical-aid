// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'models/users.models';
import { Hospital } from 'models/hospitals.models';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Patient } from 'models/patients.models';
import { Donation } from 'models/donations.models';
import { Transaction } from 'sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Hospital,
      Patient,
      Donation,
      Transaction,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
