import { Controller, Post, Body, Query, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../../../../common/dto/user/register.dto';
import { UserUpdateDto } from '../../../../common/dto/user/update-user.dto';
import { UserResponse } from '../../../../common/ro/user/user-response.ro';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() dto: RegisterDto): Promise<UserResponse> {
    return this.userService.createUser(dto);
  }

  @Get()
  public async getUser(
    @Query('userName') userName: string,
  ): Promise<UserResponse | null> {
    return this.userService.getUserByUserName(userName);
  }

  @Put('update')
  public async updateUser(
    @Body() body: Partial<UserUpdateDto>,
  ): Promise<UserResponse> {
    return this.userService.updateUserProfile(body);
  }

  @Get('paginated-users')
  public async paginatedUsers(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search?: string,
  ): Promise<{ users: UserResponse[]; total: number }> {
    return this.userService.paginatedUsers(
      userName,
      Number(page),
      Number(pageSize),
      search,
    );
  }
}
