import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'chats',
})
export class Chat {
  @Prop({ required: true, trim: true })
  chatName: string;

  @Prop({ required: true, type: [String], default: [] })
  messages: string[];

  @Prop({ required: true, type: [String], default: [] })
  participants: string[];
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
