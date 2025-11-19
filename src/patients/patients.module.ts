import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'models/users.models';
import { Hospital } from 'models/hospitals.models';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from 'models/patients.models';
import { Donation } from 'models/donations.models';
import { Transactions } from 'models/transactions.models';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    SequelizeModule.forFeature([
      User,
      Hospital,
      Patient,
      Donation,
      Transactions,
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
