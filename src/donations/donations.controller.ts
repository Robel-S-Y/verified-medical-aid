import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { MakeDonationtDto } from './dto/make-Donation.dto';
import { Public } from 'src/auth/public.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { Cache } from 'src/redis/cache.decorator';
import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';

@Controller('donations')
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  @Post()
  @Roles('donor')
  async make(@Req() req, @Body() body: MakeDonationtDto) {
    const result = this.donationsService.makeDonation(body, req.user_id);

    await this.cacheInvalidation.clearPrefix('/donations');

    return result;
  }

  @Post('retry/:id')
  @Roles('owningdonor')
  async retry(@Param('id') id: string) {
    const result = this.donationsService.retryDonationPayment(id);

    await this.cacheInvalidation.clearPrefix('/donations');

    return result;
  }

  @Get()
  @Public()
  @Cache(600)
  async findAll() {
    return this.donationsService.getDonations();
  }

  @Get(':id')
  @Public()
  @Cache(600)
  async findOne(@Param('id') id: string) {
    return this.donationsService.getDonationById(id);
  }
}
