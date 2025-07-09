import { IsNotEmpty, IsString } from 'class-validator';
import { CONTACT_FIELDS } from '../../../constants/contact.constants';

export class ContactRo {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;
}

type ContactNameField = typeof CONTACT_FIELDS.CONTACT_NAME;
export type GetAllContactsResponse = Partial<
  Omit<ContactRo, ContactNameField>
>[];
