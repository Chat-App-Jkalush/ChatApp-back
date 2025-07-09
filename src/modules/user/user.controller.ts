import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../../../common/dto/user/user.dto';
import { UserResponse } from './Ro/user.ro';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(dto);
  }
}
