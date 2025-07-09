import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from 'src/database/schemas/contacts.schema';
import { CreateContactDto } from '../../../../common/dto/contact.dto';
import { ContactRo, GetAllContactsResponse } from './Ro/contact.ro';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async createContact(dto: CreateContactDto): Promise<ContactRo> {
    const createdContact = new this.contactModel(dto);
    const savedContact = await createdContact.save();
    return {
      userName: savedContact.userName,
      contactName: savedContact.contactName,
    };
  }

  async getAllUserContacts(userName: string): Promise<GetAllContactsResponse> {
    const contacts = await this.contactModel.find({ userName }).exec();
    return contacts.map((contact) => ({
      contactName: contact.contactName,
    }));
  }
}
