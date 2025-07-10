import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../../../../common/dto/user.dto';
import { UserResponse } from '../../../../common/Ro/user.ro';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: RegisterDto): Promise<UserResponse> {
    return this.userService.createUser(dto);
  }

  @Get()
  async getUser(
    @Query('userName') userName: string,
  ): Promise<UserResponse | null> {
    return this.userService.getUserByUserName(userName);
  }
}
