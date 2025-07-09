import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'chatMessages',
})
export class ChatMessages {
  @Prop({ required: true, trim: true })
  chatId: string;

  @Prop({ required: true, trim: true })
  messageId: string;
}
export const ChatMessagesSchema = SchemaFactory.createForClass(ChatMessages);
