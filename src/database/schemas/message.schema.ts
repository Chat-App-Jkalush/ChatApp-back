import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EXPIRES_IN } from 'src/constants/message.constants';

export type MessageDocument = Message &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  collection: 'messages',
})
export class Message {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  chatId: string;

  @Prop({ expires: EXPIRES_IN, type: Date, default: Date.now })
  createdAt?: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
