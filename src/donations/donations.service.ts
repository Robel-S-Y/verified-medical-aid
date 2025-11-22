import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from 'models/donations.models';
import { Transactions } from 'models/transactions.models';
import { Patient } from 'models/patients.models';
import { User } from 'models/users.models';
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

    @InjectModel(Patient)
    private patientModel: typeof Patient,

    private sequelize: Sequelize,
  ) {}

  async makeDonation(dto: MakeDonationtDto, user_id: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    const patient = await this.patientModel.findByPk(dto.Patient_id);

    if (!patient)
      throw new HttpException(
        'No patient with this id!',
        HttpStatus.BAD_REQUEST,
      );

    if (patient.toJSON().treatment_cost === patient.toJSON().paid_amount) {
      throw new HttpException(
        'Enough Donation have been collected!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const needed =
      patient.toJSON().treatment_cost - patient.toJSON().paid_amount;

    if (dto.amount > needed) {
      throw new HttpException(
        'Amount of Donation is greater than needed!',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const donation = await this.donationModel.create({
        ...dto,
        donor_id: user_id,
      });

      const newTx = await this.transactionModel.create({
        donation_id: donation.id,
        gateway: 'stripe',
      });

      await donation.update({ latest_transaction_id: newTx.id });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(donation.toJSON().amount),
        currency: 'usd',
        metadata: {
          donation_id: donation.id.toString(),
          transaction_id: newTx.id.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      await newTx.update({ payment_intent_id: paymentIntent.id });

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

  async retryDonationPayment(donationId: string): Promise<any> {
    const sequelizeTx = await this.sequelize.transaction();

    try {
      const donation = await this.donationModel.findByPk(donationId);
      if (!donation) {
        throw new HttpException('Donation not found', HttpStatus.NOT_FOUND);
      }

      if (donation.toJSON().payment_status === 'Completed') {
        throw new HttpException(
          'Donation already completed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newTx = await this.transactionModel.create({
        donation_id: donation.id,
        gateway: 'stripe',
      });

      await donation.update({ latest_transaction_id: newTx.id });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(donation.toJSON().amount),
        currency: 'usd',
        metadata: {
          donation_id: donation.id.toString(),
          transaction_id: newTx.id.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      await newTx.update({ payment_intent_id: paymentIntent.id });

      return {
        message: 'Retry payment initiated. Awaiting payment.',
        donation,
        transaction: newTx,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      await sequelizeTx.rollback();
      throw new HttpException(
        (error.message as string) || 'Failed to retry donation payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getDonations() {
    const donations = await this.donationModel.findAll({
      include: [
        {
          model: Transactions,
          as: 'transaction',
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });
    return {
      message: 'successfully fetched donations',
      donations: donations,
    };
  }

  async getDonationById(id: string) {
    const donation = await this.donationModel.findByPk(id, {
      include: [
        {
          model: Transactions,
          as: 'transaction',
        },
      ],
    });
    if (!donation) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return {
      message: 'successfully fetched Donation',
      donation: donation,
    };
  }
}
