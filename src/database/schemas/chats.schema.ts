import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { chatType } from '../../../../common/enums/chat.enum';

@Schema({
  timestamps: true,
  collection: 'chats',
})
export class Chat {
  @Prop({ required: true, trim: true })
  chatName: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, type: [String], default: [] })
  messages: string[];

  @Prop({ required: true, type: [String], default: [] })
  participants: string[];

  @Prop({ required: true, enum: Object.values(chatType), default: chatType.DM })
  type: chatType;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
