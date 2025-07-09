import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'chats',
})
export class Chat {
  @Prop({ required: true, trim: true })
  chatName: string;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
