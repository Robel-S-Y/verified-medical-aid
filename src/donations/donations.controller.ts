import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { MakeDonationtDto } from './dto/make-Donation.dto';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @Roles('donor')
  async make(@Req() req, @Body() body: MakeDonationtDto) {
    return this.donationsService.makeDonation(body, req.user_id);
  }

  @Post('retry/:id')
  @Roles('owningdonor')
  async retry(@Param('id') id: string) {
    return this.donationsService.retryDonationPayment(id);
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
