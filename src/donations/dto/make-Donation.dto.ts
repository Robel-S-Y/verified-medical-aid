import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class MakeDonationtDto {
  @IsOptional()
  @IsString()
  donor_id: string;

  @IsNotEmpty()
  @IsString()
  Patient_id: string;

  @IsOptional()
  @IsString()
  guest_name: string;

  @IsOptional()
  @IsString()
  guest_email: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
