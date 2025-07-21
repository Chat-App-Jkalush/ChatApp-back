import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { DataCookieService } from './dataCookie.service';
import { DataCookie } from 'src/database/schemas/dataCookie.schema';
import { LatestChatIdDTO } from '../../../../common/dto';
import { Request, Response } from 'express';

@Controller('data-cookie')
export class DataCookieController {
  constructor(private readonly dataCookieService: DataCookieService) {}

  @Post('save')
  public async saveUserCookie(
    @Req() req: Request,
    @Body() body: { userName: string },
    @Res() res: Response,
  ): Promise<Response> {
    const token = req.cookies['token'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const dataCookie = await this.dataCookieService.saveUserCookie({
      userName: body.userName,
      cookie: token,
    });
    return res.json(dataCookie);
  }

  @Get('get')
  public async getUserCookie(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const token = req.cookies['token'];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const dataCookie = await this.dataCookieService.getUserCookie(token);
    if (!dataCookie) {
      return res.status(404).json({ message: 'No data cookie found' });
    }
    return res.json(dataCookie);
  }

  @Post('set-latest-chat')
  public async setLatestChatId(
    @Body() dto: LatestChatIdDTO,
  ): Promise<DataCookie | null> {
    return this.dataCookieService.setLatestChatId(
      dto.userName,
      dto.latestChatId,
    );
  }
}
