import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserResponse } from './Ro/user.ro';
import { RegisterDto } from '../../../../common/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: RegisterDto): Promise<UserResponse> {
    return this.userService.createUser(dto);
  }
}
