import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ContactDocument = Contact &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  collection: 'contacts',
})
export class Contact {
  @Prop({ required: true, trim: true })
  userName: string;

  @Prop({ required: true, trim: true })
  contactName: string;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);
