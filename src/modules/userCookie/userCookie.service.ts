import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCookie } from 'src/database/schemas/userCookie.schema';

@Injectable()
export class UserCookieService {
  constructor(
    @InjectModel(UserCookie.name) private readonly userModel: Model<UserCookie>,
  ) {}

  async saveUserCookie(
    userDetails: UserCookie,
    cookie: string,
  ): Promise<UserCookie> {
    const userCookie = new this.userModel({ userDetails, cookie });
    return await userCookie.save();
  }

  async getUserCookie(cookie: string): Promise<UserCookie | null> {
    return this.userModel.findOne({ cookie }).exec();
  }
}
