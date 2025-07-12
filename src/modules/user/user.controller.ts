import { Controller, Post, Body, Query, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, UserUpdateDto } from '../../../../common/dto/user.dto';
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

  @Put('update')
  async updateUser(
    @Body() body: Partial<UserUpdateDto>,
  ): Promise<UserResponse> {
    return this.userService.updateUserProfile(body);
  }

  @Get('paginated-chats')
  async paginatedChats(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.userService.paginatedChats(
      userName,
      Number(page),
      Number(pageSize),
    );
  }

  @Get('paginated-users')
  async paginatedUsers(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.userService.paginatedUsers(
      userName,
      Number(page),
      Number(pageSize),
    );
  }
}
