import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserCookieRo } from '../../../../common/ro/dataCookie/user-cookie.ro';
import { CommonConstants } from '../../../../common';
@Schema({
  timestamps: true,
  collection: 'userCookies',
})
export class DataCookie {
  @Prop({ required: true, trim: true, unique: true })
  userName: string;

  @Prop({ trim: true, required: true })
  firstName: string;

  @Prop({ trim: true, required: true })
  lastName: string;

  @Prop({
    required: true,
    trim: true,
    expires: CommonConstants.CookiesConstants.EXPERATION_TIME_NUMBER,
  })
  cookie: string;

  @Prop({ trim: true, required: false })
  latestChatId?: string;
}
export const DataCookieSchema = SchemaFactory.createForClass(DataCookie);
