/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  InternalServerErrorException,
  //BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { User } from 'models/users.models';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { generateToken } from 'src/utils/jwt.util';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createUser(dto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await argon2.hash(dto.password);

      const user = await this.userModel.create({
        ...dto,
        password: hashedPassword,
      });

      const { password, ...rest } = user.toJSON();
      return {
        message: 'successfully created user',
        user: rest,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsers() {
    const users = await this.userModel.findAll();

    const Users = users.map((u) => {
      const { password, ...rest } = u.toJSON();
      return rest as User;
    });
    return {
      message: 'successfully fetched users',
      users: Users,
    };
  }

  async getUserById(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const { password, ...rest } = user.toJSON();
    const User = rest as User;
    return {
      message: 'successfully fetched user',
      user: User,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    const hashedPassword = await argon2.hash(dto.password);

    await user.update({ ...dto, password: hashedPassword });

    const { password, ...rest } = user.toJSON();
    return {
      message: 'successfully updated user',
      user: {
        id: rest.id,
        name: rest.name,
        email: rest.email,
        phone: rest.phone,
        role: rest.role,
        createdAt: rest.createdAt,
        updatedAt: rest.updatedAt,
      },
    };
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  async login(dto: LoginUserDto): Promise<any> {
    const email = dto.email;
    const user = await User.findOne({ where: { email } });
    console.log(user?.dataValues.role);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await argon2.verify(
      user?.dataValues.password,
      dto.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const access_token = generateToken({
      payload: { user_id: user.id, role: user.dataValues.role },
      type: 'access_token',
      expiresIn: '30m',
    });

    const refresh_token = generateToken({
      payload: { user_id: user.id },
      type: 'refresh_token',
      expiresIn: '2h',
    });

    const { password: password, ...rest } = user.toJSON();

    return {
      message: 'Login successfully',
      user: rest,
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET_REFRESH,
      );

      const user = await User.findByPk(decoded.user_id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const access_token = generateToken({
        payload: { user_id: user.id, role: user.dataValues.role },
        type: 'access_token',
        expiresIn: '30m',
      });

      const refresh_token_new = generateToken({
        payload: { user_id: user.id },
        type: 'refresh_token',
        expiresIn: '2h',
      });

      return {
        message: 'Token refreshed successfully',
        access_token,
        refresh_token: refresh_token_new,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }
}
