import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmbeddedMessage {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}
export const EmbeddedMessageSchema =
  SchemaFactory.createForClass(EmbeddedMessage);
