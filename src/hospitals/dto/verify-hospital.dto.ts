import { IsNotEmpty, IsBoolean } from 'class-validator';

export class VerifyHospitalDto {
  @IsNotEmpty()
  @IsBoolean()
  verified: boolean;
}
