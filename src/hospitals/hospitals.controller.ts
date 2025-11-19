import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalResponseDto } from './dto/hospital-response.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';
import { VerifyHospitalDto } from './dto/verify-hospital.dto';
import { Cache } from 'src/redis/cache.decorator';
import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';

@Controller('hospitals')
export class HospitalsController {
  constructor(
    private readonly hospitalsService: HospitalsService,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  @Post()
  @Roles('hospital')
  async create(@Req() req, @Body() body: CreateHospitalDto) {
    const result = this.hospitalsService.createHospital(body, req.user_id);

    await this.cacheInvalidation.clearPrefix('/hospitals');

    return result;
  }

  @Get()
  @Public()
  @Cache(600)
  async findAll() {
    return this.hospitalsService.getHospitals();
  }

  @Get(':id')
  @Public()
  @Cache(600)
  async findOne(@Param('id') id: string) {
    return this.hospitalsService.getHospitalById(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateHospitalDto,
  ): Promise<HospitalResponseDto> {
    const result = this.hospitalsService.updateHospital(id, body);

    await this.cacheInvalidation.clearPrefix('/hospitals');

    return result;
  }

  @Patch('verify/:id')
  @Roles('admin')
  async verify(
    @Param('id') id: string,
    @Body() body: VerifyHospitalDto,
  ): Promise<HospitalResponseDto> {
    const result = this.hospitalsService.verifyHospital(id, body);

    await this.cacheInvalidation.clearPrefix('/hospitals');

    return result;
  }

  @Delete(':id')
  @Roles('admin', 'hospital')
  async remove(@Param('id') id: string) {
    const result = this.hospitalsService.deleteHospital(id);

    await this.cacheInvalidation.clearPrefix('/hospitals');

    return result;
  }
}
