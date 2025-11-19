import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from 'models/patients.models';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { VerifyPatientDto } from './dto/verify-patient.dto';
import { Donation } from 'models/donations.models';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient)
    private patientModel: typeof Patient,
  ) {}

  async createPatient(
    dto: CreatePatientDto,
    hospital_id: string,
  ): Promise<any> {
    try {
      const patient = await this.patientModel.create({
        ...dto,
        hospital_id: hospital_id,
      });

      return {
        message: 'successfully created Patient',
        patient: patient,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create patient',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPatients() {
    const patients = await this.patientModel.findAll({
      include: [
        {
          model: Donation,
          as: 'donation',
        },
      ],
    });
    return {
      message: 'successfully fetched patients',
      patients: patients,
    };
  }

  async getPatientById(id: string) {
    const patient = await this.patientModel.findByPk(id, {
      include: [
        {
          model: Donation,
          as: 'donation',
        },
      ],
    });
    if (!patient) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    return {
      message: 'successfully fetched Patient',
      patient: patient,
    };
  }

  async updatePatient(
    id: string,
    dto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientModel.findByPk(id);
    if (!patient) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await patient.update(dto);

    return {
      message: 'successfully updated patient',
      patient: {
        id: patient.id,
        full_name: patient.full_name,
        age: patient.age,
        diagnosis: patient.diagnosis,
        treatment_cost: patient.treatment_cost,
        treatment_status: patient.treatment_status,
        document_url: patient.treatment_status,
        verification_status: patient.verification_status,
        hospital_id: patient.treatment_status,
      },
    };
  }

  async verifyPatient(
    id: string,
    dto: VerifyPatientDto,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientModel.findByPk(id);
    if (!patient) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await patient.update(dto);

    return {
      message: 'successfully verified patient',
      patient: {
        id: patient.id,
        full_name: patient.full_name,
        age: patient.age,
        diagnosis: patient.diagnosis,
        treatment_cost: patient.treatment_cost,
        treatment_status: patient.treatment_status,
        document_url: patient.treatment_status,
        verification_status: patient.verification_status,
        hospital_id: patient.treatment_status,
      },
    };
  }

  async deletePatient(id: string) {
    const patient = await this.patientModel.findByPk(id);
    if (!patient) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await patient.destroy();
    return { message: 'Patient deleted successfully' };
  }
}
