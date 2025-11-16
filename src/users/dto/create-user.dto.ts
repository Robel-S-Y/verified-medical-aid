import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMobilePhone,
  Matches,
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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\[\]{};':"\\|,.<>\/?])[^\s]{8,}$/,
    {
      message:
        'Password is too weak. Must contain at least 8 characters, uppercase, lowercase, number, and special character.',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'hospital', 'donor'], {
    message: 'Invalid role!',
  })
  role: 'admin' | 'hospital' | 'donor';

  @IsOptional()
  @IsMobilePhone()
  phone?: string;
}
