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
      firstName: string;
      lastName: string;
      cookie: string;
    },
  ): Promise<DataCookie> {
    return this.dataCookieService.saveUserCookie(body);
  }

  @Get('get')
  async getUserCookie(
    @Query('cookie') cookie: string,
  ): Promise<DataCookie | null> {
    return this.dataCookieService.getUserCookie(cookie);
  }
}
