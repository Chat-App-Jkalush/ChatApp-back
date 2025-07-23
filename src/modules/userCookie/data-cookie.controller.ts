import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { DataCookieService } from './data-cookie.service';
import { LatestChatIdDTO } from '../../../../common/dto/dataCookie/latest-chat-id.dto';
import { Request, Response } from 'express';
import { UserCookieRo } from '../../../../common/ro/dataCookie/user-cookie.ro';

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
    const result: UserCookieRo = {
      userName: dataCookie.userName,
      cookie: dataCookie.cookie,
      latestChatId: dataCookie.latestChatId,
    };
    return res.json(result);
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
    const result: UserCookieRo = {
      userName: dataCookie.userName,
      cookie: dataCookie.cookie,
      latestChatId: dataCookie.latestChatId,
    };
    return res.json(result);
  }

  @Post('set-latest-chat')
  public async setLatestChatId(
    @Body() dto: LatestChatIdDTO,
  ): Promise<UserCookieRo | null> {
    const dataCookie = await this.dataCookieService.setLatestChatId(
      dto.userName,
      dto.latestChatId,
    );
    if (!dataCookie) return null;
    return {
      userName: dataCookie.userName,
      cookie: dataCookie.cookie,
      latestChatId: dataCookie.latestChatId,
    };
  }
}
