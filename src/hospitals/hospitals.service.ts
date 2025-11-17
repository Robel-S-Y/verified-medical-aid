import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hospital } from 'models/hospitals.models';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalResponseDto } from './dto/hospital-response.dto';
import { VerifyHospitalDto } from './dto/verify-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital)
    private hospitalModel: typeof Hospital,
  ) {}

  async createHospital(dto: CreateHospitalDto, user_id: string): Promise<any> {
    try {
      console.log(user_id);
      const hospital = await this.hospitalModel.create({
        ...dto,
        user_id: user_id,
      });

      return {
        message: 'successfully fetched Hospital',
        hospital: hospital,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create hospital',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getHospitals() {
    const hospitals = await this.hospitalModel.findAll();
    return {
      message: 'successfully fetched Hospitas',
      hospitals: hospitals,
    };
  }

  async getHospitalById(id: string) {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return {
      message: 'successfully fetched Hospital',
      hospital: hospital,
    };
  }

  async updateHospital(
    id: string,
    dto: UpdateHospitalDto,
  ): Promise<HospitalResponseDto> {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await hospital.update(dto);

    return {
      message: 'successfully updated hospital',
      hospital: {
        id: hospital.id,
        name: hospital.name,
        license_number: hospital.license_number,
        address: hospital.address,
        verified: hospital.verified,
        user_id: hospital.user_id,
      },
    };
  }

  async verifyHospital(
    id: string,
    dto: VerifyHospitalDto,
  ): Promise<HospitalResponseDto> {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await hospital.update(dto);

    return {
      message: 'successfully verified hospital',
      hospital: {
        id: hospital.id,
        name: hospital.name,
        license_number: hospital.license_number,
        address: hospital.address,
        verified: hospital.verified,
        user_id: hospital.user_id,
      },
    };
  }

  async deleteHospital(id: string) {
    const hospital = await this.hospitalModel.findByPk(id);
    if (!hospital) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await hospital.destroy();
    return { message: 'Hospital deleted successfully' };
  }
}
