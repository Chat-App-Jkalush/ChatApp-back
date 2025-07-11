import { Controller, Post, Body, Query, Get, Put } from '@nestjs/common';
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

  @Put('update')
  async updateUser(
    @Body() body: { userName: string; chatId: string; chatName: string },
  ): Promise<UserResponse> {
    const { userName, chatId, chatName } = body;
    return this.userService.updateUser(userName, chatId, chatName);
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
}
