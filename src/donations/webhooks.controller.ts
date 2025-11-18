import {
  Controller,
  Post,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Response, Request } from 'express';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/sequelize';
import { Transactions } from 'models/transactions.models';
import { Donation } from 'models/donations.models';
import { Patient } from 'models/patients.models';
import { Public } from 'src/auth/public.decorator';

@Controller('webhooks')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(
    @InjectModel(Transactions)
    private transactionModel: typeof Transactions,

    @InjectModel(Donation)
    private donationModel: typeof Donation,

    @InjectModel(Patient)
    private patientModel: typeof Patient,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }

  @Post('stripe')
  @Public()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) {
      throw new HttpException(
        'Missing Stripe signature',
        HttpStatus.BAD_REQUEST,
      );
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody!,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: any) {
      console.error('WEBHOOK ERROR:', err.message);
      console.error('SIG:', sig);
      console.error('SECRET:', process.env.STRIPE_WEBHOOK_SECRET);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const handlePaymentSucceeded = async (intent: Stripe.PaymentIntent) => {
      const txId = intent.metadata.transaction_id;
      const donationId = intent.metadata.donation_id;

      const tx = await this.transactionModel.findByPk(txId);
      console.log(tx);
      if (tx) {
        tx.status = 'Completed';
        tx.gateway_response = intent;
        await tx.save();
      }

      const donation = await this.donationModel.findByPk(donationId);
      console.log(donation);
      if (donation) {
        donation.payment_status = 'Completed';
        await donation.save();

        const patientId = donation.Patient_id;

        const patient = await Patient.findByPk(patientId);
        if (patient) {
          const totalPaid = await this.donationModel.sum('amount', {
            where: {
              Patient_id: patient.id,
              payment_status: 'Completed',
            },
          });
          patient.paid_amount = totalPaid;
          await patient.save();
        }
      }
    };

    const handlePaymentFailed = async (intent: Stripe.PaymentIntent) => {
      const txId = intent.metadata.transaction_id;

      const tx = await this.transactionModel.findByPk(txId);
      if (tx) {
        tx.status = 'Failed';
        tx.gateway_response = intent;
        await tx.save();
      }
    };

    if (event.type === 'payment_intent.succeeded') {
      await handlePaymentSucceeded(event.data.object);
    }
    console.log(event.type === 'payment_intent.succeeded');
    if (event.type === 'payment_intent.payment_failed') {
      await handlePaymentFailed(event.data.object);
    }

    res.json({ received: true });
  }
}
