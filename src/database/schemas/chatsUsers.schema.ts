import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ChatsUsersDocument = ChatsUsers &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  collection: 'chatsUsers',
})
export class ChatsUsers {
  @Prop({ required: true, trim: true })
  chatId: string;

  @Prop({ required: true, trim: true })
  userId: string;
}
export const ChatsUsersSchema = SchemaFactory.createForClass(ChatsUsers);
