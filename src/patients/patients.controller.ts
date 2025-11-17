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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';
import { VerifyPatientDto } from './dto/verify-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles('hospital')
  async create(@Req() req, @Body() body: CreatePatientDto) {
    return this.patientsService.createPatient(body, req.hospital_id);
  }

  @Get()
  @Public()
  async findAll() {
    return this.patientsService.getPatients();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Patch(':patient_id')
  @Roles('admin', 'hospital')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientsService.updatePatient(id, body);
  }

  @Patch('verify/:id')
  @Roles('admin')
  async verify(
    @Param('id') id: string,
    @Body() body: VerifyPatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientsService.verifyPatient(id, body);
  }

  @Delete(':id')
  @Roles('admin', 'hospital')
  async remove(@Param('id') id: string) {
    return this.patientsService.deletePatient(id);
  }
}
