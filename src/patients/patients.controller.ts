import {
  Controller,
  UseInterceptors,
  UploadedFile,
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
import { Cache } from 'src/redis/cache.decorator';
import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

  @Post()
  @Roles('hospital')
  async create(@Req() req, @Body() body: CreatePatientDto) {
    const result = this.patientsService.createPatient(body, req.hospital_id);

    await this.cacheInvalidation.clearPrefix('/patients');

    return result;
  }

  @Post('upload-document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `doc-${unique}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isPdf =
          file.mimetype === 'application/pdf' ||
          file.originalname.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
          return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDoc(@UploadedFile() file: Express.Multer.File) {
    const document_url = `/uploads/documents/${file.filename}`;
    return {
      message: 'Document uploaded successfully',
      document_url,
    };
  }


  @Get()
  @Public()
  @Cache(600)
  async findAll() {
    return this.patientsService.getPatients();
  }

  @Get(':id')
  @Public()
  @Cache(600)
  async findOne(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    const result = this.patientsService.updatePatient(id, body);

    await this.cacheInvalidation.clearPrefix('/patients');

    return result;
  }

  @Patch('verify/:id')
  @Roles('admin')
  async verify(
    @Param('id') id: string,
    @Body() body: VerifyPatientDto,
  ): Promise<PatientResponseDto> {
    const result = this.patientsService.verifyPatient(id, body);

    await this.cacheInvalidation.clearPrefix('/patients');

    return result;
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    const result = this.patientsService.deletePatient(id);

    await this.cacheInvalidation.clearPrefix('/patients');

    return result;
  }
}
