import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from 'models/donations.models';
import { Transactions } from 'models/transactions.models';
import { Sequelize } from 'sequelize-typescript';
import { MakeDonationtDto } from './dto/make-Donation.dto';
import Stripe from 'stripe';

@Injectable()
export class DonationsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

  constructor(
    @InjectModel(Donation)
    private donationModel: typeof Donation,

    @InjectModel(Transactions)
    private transactionModel: typeof Transactions,

    private sequelize: Sequelize,
  ) {}

  async makeDonation(dto: MakeDonationtDto): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      const donation = await this.donationModel.create(
        {
          ...dto,
        },
        { transaction },
      );

      const newTx = await this.transactionModel.create(
        {
          donation_id: donation.id,
          gateway: 'stripe',
        },
        { transaction },
      );

      donation.latest_transaction_id = newTx.id;
      await donation.save({ transaction });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(donation.toJSON().amount * 100),
        currency: 'usd',
        metadata: {
          donation_id: donation.id.toString(),
          transaction_id: newTx.id.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      newTx.payment_intent_id = paymentIntent.id;
      await newTx.save({ transaction });

      await transaction.commit();

      return {
        message: 'Donation created. Awaiting payment.',
        donation,
        transaction: newTx,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        (error.message as string) || 'Failed to create donation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getDonations() {
    const donations = await this.donationModel.findAll();
    return {
      message: 'successfully fetched donations',
      donations: donations,
    };
  }

  async getDonationById(id: string) {
    const donation = await this.donationModel.findByPk(id);
    if (!donation) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return {
      message: 'successfully fetched Donation',
      donation: donation,
    };
  }
}
