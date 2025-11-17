import { IsNotEmpty, IsEnum } from 'class-validator';

export class VerifyPatientDto {
  @IsNotEmpty()
  @IsEnum(['pending', 'verified', 'rejected'], {
    message: 'Invalid status!',
  })
  verification_status: 'pending' | 'verified' | 'rejected';
}
