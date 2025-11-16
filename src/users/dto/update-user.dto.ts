import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsMobilePhone,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\[\]{};':"\\|,.<>\/?])[^\s]{8,}$/,
    {
      message:
        'Password is too weak. Must contain at least 8 characters, uppercase, lowercase, number, and special character.',
    },
  )
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'hospital', 'donor'], {
    message: 'Invalid role!',
  })
  role: 'admin' | 'hospital' | 'donor';

  @IsOptional()
  @IsMobilePhone()
  phone?: string;
}
