/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  Headers,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() body: CreateUserDto, @Req() req: any) {
    if (body.role === 'admin') {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        throw new HttpException(
          'Authorization header missing',
          HttpStatus.FORBIDDEN,
        );
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new HttpException('Token missing', HttpStatus.FORBIDDEN);
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      } catch (err) {
        throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
      }

      if (decoded.role !== 'admin') {
        throw new HttpException(
          'Only admins can create admin users',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return this.usersService.createUser(body);
  }

  @Get()
  @Roles('admin')
  async findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, body);
  }
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
  @Post('login')
  @Public()
  @HttpCode(200)
  async login(@Body() loginDto: LoginUserDto) {
    const { user, access_token, refresh_token } =
      await this.usersService.login(loginDto);

    return { user, access_token, refresh_token };
  }
  @Post('refresh')
  @Public()
  @HttpCode(200)
  async refresh(@Headers('authorization') authHeader: string) {
    const refreshToken = authHeader?.split(' ')[1];
    return this.usersService.refreshToken(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new HttpException(
        'Authorization header missing',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.usersService.logout(authHeader);
  }
}
