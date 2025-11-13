import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  //Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get()
  async findAll() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, body);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
