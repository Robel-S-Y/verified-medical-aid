import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'models/users.models';
import { Hospital } from 'models/hospitals.models';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { Patient } from 'models/patients.models';
import { Donation } from 'models/donations.models';
import { Transactions } from 'models/transactions.models';
import { StripeWebhookController } from './webhooks.controller';
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
  controllers: [DonationsController, StripeWebhookController],
  providers: [DonationsService],
})
export class DonationsModule {}
