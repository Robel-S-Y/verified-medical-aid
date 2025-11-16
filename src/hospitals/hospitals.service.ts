import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hospital } from 'models/hospitals.models';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalResponseDto } from './dto/hospital-response.dto';
//import * as jwt from 'jsonwebtoken';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital)
    private hospitalModel: typeof Hospital,
  ) {}

  async createHospital(dto: CreateHospitalDto): Promise<Hospital> {
    try {
      const hospital = await this.hospitalModel.create({ ...dto });
      return hospital;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create hospital',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getHospitals() {
    const hospitals = await this.hospitalModel.findAll();
    return hospitals;
  }

  async getHospitalById(id: string) {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return hospital;
  }

  async updateHospital(
    id: string,
    dto: UpdateHospitalDto,
  ): Promise<HospitalResponseDto> {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await hospital.update(dto);

    return hospital;
  }

  async deleteHospital(id: string) {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await hospital.destroy();
    return { message: 'Hospital deleted successfully' };
  }
}
