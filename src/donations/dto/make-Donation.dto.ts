import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class MakeDonationtDto {
  @IsNotEmpty()
  @IsString()
  Patient_id: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
