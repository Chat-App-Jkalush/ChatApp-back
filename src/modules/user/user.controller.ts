import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './Ro/user.ro';
import { CreateUserDto } from '../../../../common/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(dto);
  }
}
