import { Controller, Post, Body, Query, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonDto, CommonRo } from '../../../../common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(
    @Body() dto: CommonDto.UserDto.RegisterDto,
  ): Promise<CommonRo.UserRo.UserResponse> {
    return this.userService.createUser(dto);
  }

  @Get()
  public async getUser(
    @Query('userName') userName: string,
  ): Promise<CommonRo.UserRo.UserResponse | null> {
    return this.userService.getUserByUserName(userName);
  }

  @Put('update')
  public async updateUser(
    @Body() body: Partial<CommonDto.UserDto.UserUpdateDto>,
  ): Promise<CommonRo.UserRo.UserResponse> {
    return this.userService.updateUserProfile(body);
  }

  @Get('paginated-chats')
  public async paginatedChats(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ): Promise<{ chats: string[]; total: number }> {
    return this.userService.paginatedChats(
      userName,
      Number(page),
      Number(pageSize),
    );
  }

  @Get('paginated-users')
  public async paginatedUsers(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ): Promise<{ users: CommonRo.UserRo.UserResponse[]; total: number }> {
    return this.userService.paginatedUsers(
      userName,
      Number(page),
      Number(pageSize),
    );
  }
}
