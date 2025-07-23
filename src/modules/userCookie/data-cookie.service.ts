import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataCookie } from './schemas/data-cookie.schema';
import { UserCookieRo } from '../../../../common/ro/dataCookie/user-cookie.ro';
import { SaveDataCookieDTO } from '../../../../common/dto/dataCookie/save-data-cookie.dto';
@Injectable()
export class DataCookieService {
  constructor(
    @InjectModel(DataCookie.name) private readonly userModel: Model<DataCookie>,
  ) {}

  public async saveUserCookie(dto: SaveDataCookieDTO): Promise<UserCookieRo> {
    const dataCookie = await this.userModel
      .findOneAndUpdate(
        { userName: dto.userName },
        { $set: dto },
        { upsert: true, new: true },
      )
      .exec();
    return {
      userName: dataCookie.userName,
      cookie: dataCookie.cookie,
      latestChatId: dataCookie.latestChatId,
    };
  }

  public async getUserCookie(cookie: string): Promise<UserCookieRo | null> {
    const dataCookie = await this.userModel.findOne({ cookie }).exec();
    if (!dataCookie) return null;
    return {
      userName: dataCookie.userName,
      cookie: dataCookie.cookie,
      latestChatId: dataCookie.latestChatId,
    };
  }

  public async setLatestChatId(
    userName: string,
    latestChatId: string,
  ): Promise<UserCookieRo | null> {
    const dataCookie = await this.userModel
      .findOneAndUpdate({ userName }, { latestChatId }, { new: true })
      .exec();
    if (!dataCookie) return null;
    return {
      userName: dataCookie.userName,
      cookie: dataCookie.cookie,
      latestChatId: dataCookie.latestChatId,
    };
  }
}
