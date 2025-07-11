import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserResponse } from '../../../../common/Ro/user.ro';
import { EXPERATION_TIME_NUMBER } from '../../../../common/constatns/cookies.constants';

@Schema({
  timestamps: true,
  collection: 'userCookies',
})
export class UserCookie {
  @Prop({ required: true, trim: true, unique: true })
  userName: string;

  @Prop({ trim: true, required: true })
  firstName: string;

  @Prop({ trim: true, required: true })
  lastName: string;

  @Prop({ required: true, trim: true, expires: EXPERATION_TIME_NUMBER })
  cookie: string;
}
export const UserCookieSchema = SchemaFactory.createForClass(UserCookie);
