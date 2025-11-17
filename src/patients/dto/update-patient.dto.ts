import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  full_name: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  diagnosis: string;

  @IsOptional()
  @IsNumber()
  treatment_cost: number;

  @IsOptional()
  @IsEnum(['NEED', 'TREATING', 'DONE'], {
    message: 'Invalid status!',
  })
  treatment_status: 'NEED' | 'TREATING' | 'DONE';

  @IsOptional()
  @IsString()
  document_url: string;

  @IsOptional()
  @IsString()
  hospital_id: string;
}
