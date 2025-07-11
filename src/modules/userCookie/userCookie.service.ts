import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCookie } from 'src/database/schemas/userCookie.schema';

@Injectable()
export class UserCookieService {
  constructor(
    @InjectModel(UserCookie.name) private readonly userModel: Model<UserCookie>,
  ) {}

  async saveUserCookie(body: {
    userName: string;
    firstName: string;
    lastName: string;
    cookie: string;
  }): Promise<UserCookie> {
    const userCookie = new this.userModel(body);
    return await userCookie.save();
  }

  async getUserCookie(cookie: string): Promise<UserCookie | null> {
    return this.userModel.findOne({ cookie }).exec();
  }
}
