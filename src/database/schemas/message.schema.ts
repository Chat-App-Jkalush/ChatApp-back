import { Schema, SchemaFactory } from '@nestjs/mongoose';

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
  sender: string;
  content: string;
  chatId: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
