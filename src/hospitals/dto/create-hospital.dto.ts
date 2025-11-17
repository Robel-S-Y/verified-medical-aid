import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateHospitalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  license_number: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
