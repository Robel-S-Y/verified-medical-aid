/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalResponseDto } from './dto/hospital-response.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';
//import { Public } from 'src/auth/public.decorator';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @Roles('admin', 'hospital')
  async create(@Body() body: CreateHospitalDto) {
    return this.hospitalsService.createHospital(body);
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
  @Roles('admin', 'hospital')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateHospitalDto,
  ): Promise<HospitalResponseDto> {
    return this.hospitalsService.updateHospital(id, body);
  }

  @Delete(':id')
  @Roles('admin', 'hospital')
  async remove(@Param('id') id: string) {
    return this.hospitalsService.deleteHospital(id);
  }
}
