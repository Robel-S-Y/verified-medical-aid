import {
  Injectable,
  HttpException,
  HttpStatus,
  //BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { User } from 'models/users.models';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await argon2.hash(dto.password);

      const user = await this.userModel.create({
        ...dto,
        password: hashedPassword,
      });

      const { password, ...rest } = user.toJSON();
      return rest as User;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsers() {
    const users = await this.userModel.findAll();
    return users.map((u) => {
      const { password, ...rest } = u.toJSON();
      return rest as User;
    });
  }

  async getUserById(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { password, ...rest } = user.toJSON();
    return rest as User;
  }
}
