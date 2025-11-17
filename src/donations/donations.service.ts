import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from 'models/donations.models';
import { MakeDonationtDto } from './dto/make-Donation.dto';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation)
    private donationModel: typeof Donation,
  ) {}

  async makeDonation(dto: MakeDonationtDto): Promise<any> {
    try {
      const donation = await this.donationModel.create({
        ...dto,
      });

      return {
        message: 'successfully started Donation',
        donation: donation,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create donation',
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
