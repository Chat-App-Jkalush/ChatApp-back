import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BackendConstants } from 'src/constants';

@Schema({ _id: false, expires: BackendConstants.MessageConstants.EXPIRES_IN })
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
