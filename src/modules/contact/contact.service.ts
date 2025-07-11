import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/users.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async addContact(userName: string, contactName: string) {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new Error('User not found');
    if (!user.contacts) user.contacts = [];
    if (!user.contacts.includes(contactName)) {
      user.contacts.push(contactName);
      await user.save();
    }
    return user;
  }

  async paginatedContacts(
    userName: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ contacts: string[]; total: number }> {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new Error('User not found');
    const contacts = user.contacts ?? [];
    const total = contacts.length;
    const pagedContacts = contacts.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );
    return { contacts: pagedContacts, total };
  }
}
