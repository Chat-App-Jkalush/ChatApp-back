import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UserCookieService } from './userCookie.service';
import { UserCookie } from 'src/database/schemas/userCookie.schema';

@Controller('user-cookie')
export class UserCookieController {
  constructor(private readonly userCookieService: UserCookieService) {}

  @Post('save')
  async saveUserCookie(
    @Body() body: { userDetails: UserCookie; cookie: string },
  ): Promise<UserCookie> {
    return this.userCookieService.saveUserCookie(body.userDetails, body.cookie);
  }

  @Get('get')
  async getUserCookie(
    @Query('cookie') cookie: string,
  ): Promise<UserCookie | null> {
    return this.userCookieService.getUserCookie(cookie);
  }
}
