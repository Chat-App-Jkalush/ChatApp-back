import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { chatType } from '../../../../common/enums/chat.enum';

@Schema({ _id: false })
export class EmbeddedMessage {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}
const EmbeddedMessageSchema = SchemaFactory.createForClass(EmbeddedMessage);

@Schema({
  timestamps: true,
  collection: 'chats',
})
export class Chat {
  @Prop({ required: true, trim: true })
  chatName: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: [EmbeddedMessageSchema], default: [] })
  messages: EmbeddedMessage[];

  @Prop({ required: true, type: [String] })
  participants: string[];

  @Prop({ required: true, enum: Object.values(chatType), default: chatType.DM })
  type: chatType;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
