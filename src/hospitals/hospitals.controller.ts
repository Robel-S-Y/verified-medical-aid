/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @Roles('hospital')
  async create(@Req() req, @Body() body: CreateHospitalDto) {
    return this.hospitalsService.createHospital(body, req.user_id);
  }

  @Get()
  @Public()
  async findAll() {
    return this.hospitalsService.getHospitals();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.hospitalsService.getHospitalById(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateHospitalDto,
  ): Promise<HospitalResponseDto> {
    return this.hospitalsService.updateHospital(id, body);
  }

  @Patch('verify/:id')
  @Roles('admin')
  async verify(
    @Param('id') id: string,
    @Body() body: VerifyHospitalDto,
  ): Promise<HospitalResponseDto> {
    return this.hospitalsService.verifyHospital(id, body);
  }

  @Delete(':id')
  @Roles('admin', 'hospital')
  async remove(@Param('id') id: string) {
    return this.hospitalsService.deleteHospital(id);
  }
}
