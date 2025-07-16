import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DataCookieService } from './dataCookie.service';
import { DataCookie } from 'src/database/schemas/dataCookie.schema';

@Controller('data-cookie')
export class DataCookieController {
  constructor(private readonly dataCookieService: DataCookieService) {}

  @Post('save')
  async saveUserCookie(
    @Body()
    body: {
      userName: string;
      cookie: string;
    },
  ): Promise<DataCookie> {
    try {
      return await this.dataCookieService.saveUserCookie(body);
    } catch (error) {
      console.error('Error saving user cookie:', error, body);
      throw error;
    }
  }

  @Get('get')
  async getUserCookie(
    @Query('cookie') cookie: string,
  ): Promise<DataCookie | null> {
    return this.dataCookieService.getUserCookie(cookie);
  }

  @Post('set-latest-chat')
  async setLatestChatId(
    @Body() body: { userName: string; latestChatId: string },
  ): Promise<DataCookie | null> {
    return this.dataCookieService.setLatestChatId(
      body.userName,
      body.latestChatId,
    );
  }
}
