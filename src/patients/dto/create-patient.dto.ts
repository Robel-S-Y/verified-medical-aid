import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  diagnosis: string;

  @IsNotEmpty()
  @IsNumber()
  treatment_cost: number;

  @IsNotEmpty()
  @IsUrl()
  document_url: string;
}
