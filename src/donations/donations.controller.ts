import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { MakeDonationtDto } from './dto/make-Donation.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @Public()
  async make(@Body() body: MakeDonationtDto) {
    return this.donationsService.makeDonation(body);
  }

  @Get()
  @Public()
  async findAll() {
    return this.donationsService.getDonations();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.donationsService.getDonationById(id);
  }
}
