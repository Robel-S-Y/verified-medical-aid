import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'hospital', 'donor'])
  role: 'admin' | 'hospital' | 'donor';

  @IsOptional()
  @IsMobilePhone()
  phone?: string;
}
