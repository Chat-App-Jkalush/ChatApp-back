import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true, trim: true })
  userName: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true, default: [] })
  contacts: string[];

  @Prop({ required: true, default: [] })
  chats: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
