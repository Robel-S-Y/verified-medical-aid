import { IsOptional, IsString } from 'class-validator';

export class UpdateHospitalDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  license_number: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  user_id: string;
}
