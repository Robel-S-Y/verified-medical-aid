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
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const handlePaymentSucceeded = async (intent: Stripe.PaymentIntent) => {
      const txId = intent.metadata.transaction_id;
      const donationId = intent.metadata.donation_id;

      const tx = await this.transactionModel.findByPk(txId);

      if (tx) {
        await tx.update({ status: 'Completed', gateway_response: intent });
      }

      const donation = await this.donationModel.findByPk(donationId);

      if (donation) {
        await donation.update({ payment_status: 'Completed' });

        const patientId = donation.toJSON().Patient_id;

        const patient = await Patient.findByPk(patientId);

        if (patient) {
          const totalPaid = await this.donationModel.sum('amount', {
            where: {
              Patient_id: patient.toJSON().id,
              payment_status: 'Completed',
            },
          });

          await patient.update({ paid_amount: totalPaid });
        }
      }
    };

    const handlePaymentFailed = async (intent: Stripe.PaymentIntent) => {
      const txId = intent.metadata.transaction_id;

      const tx = await this.transactionModel.findByPk(txId);
      if (tx) {
        await tx.update({ status: 'Failed', gateway_response: intent });
      }
    };

    if (event.type === 'payment_intent.succeeded') {
      await handlePaymentSucceeded(event.data.object);
    }

    if (event.type === 'payment_intent.payment_failed') {
      await handlePaymentFailed(event.data.object);
    }

    res.json({ received: true });
  }
}
