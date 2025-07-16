import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataCookie } from 'src/database/schemas/dataCookie.schema';
@Injectable()
export class DataCookieService {
  constructor(
    @InjectModel(DataCookie.name) private readonly userModel: Model<DataCookie>,
  ) {}

  async saveUserCookie(body: {
    userName: string;
    cookie: string;
    latestChatId?: string;
  }): Promise<DataCookie> {
    return await this.userModel
      .findOneAndUpdate(
        { userName: body.userName },
        { $set: body },
        { upsert: true, new: true },
      )
      .exec();
  }

  async getUserCookie(cookie: string): Promise<DataCookie | null> {
    return this.userModel.findOne({ cookie }).exec();
  }

  async setLatestChatId(
    userName: string,
    latestChatId: string,
  ): Promise<DataCookie | null> {
    return this.userModel
      .findOneAndUpdate({ userName }, { latestChatId }, { new: true })
      .exec();
  }
}
