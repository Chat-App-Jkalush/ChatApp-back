import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}
export const MessageSchema = SchemaFactory.createForClass(Message);
