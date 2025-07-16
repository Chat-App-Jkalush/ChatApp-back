import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DataCookieService } from './dataCookie.service';
import { DataCookie } from 'src/database/schemas/dataCookie.schema';
import {
  LatestChatIdDTO,
  SaveDataCookieDTO,
} from '../../../../common/dto/dataCookie.dto';

@Controller('data-cookie')
export class DataCookieController {
  constructor(private readonly dataCookieService: DataCookieService) {}

  @Post('save')
  async saveUserCookie(
    @Body()
    dto: SaveDataCookieDTO,
  ): Promise<DataCookie> {
    try {
      return await this.dataCookieService.saveUserCookie(dto);
    } catch (error) {
      console.error('Error saving user cookie:', error, dto);
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
    @Body() dto: LatestChatIdDTO,
  ): Promise<DataCookie | null> {
    return this.dataCookieService.setLatestChatId(
      dto.userName,
      dto.latestChatId,
    );
  }
}
