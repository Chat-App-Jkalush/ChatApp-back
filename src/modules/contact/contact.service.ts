import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/users.schema';
import { RemoveContactDto } from '../../../../common/dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async addContact(
    userName: string,
    contactName: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new BadRequestException('User not found');
    if (!user.contacts) user.contacts = [];
    if (!user.contacts.includes(contactName)) {
      user.contacts.push(contactName);
      await user.save();
    }
    return user;
  }

  public async paginatedContacts(
    userName: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ contacts: string[]; total: number }> {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new BadRequestException('User not found');
    const contacts = user.contacts ?? [];
    const total = contacts.length;
    const pagedContacts = contacts.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );
    return { contacts: pagedContacts, total };
  }

  public async removeContact(dto: RemoveContactDto): Promise<User> {
    const user = await this.userModel
      .findOne({ userName: dto.userName })
      .exec();
    if (!user) throw new BadRequestException('User not found');
    const contactIndex = user.contacts.indexOf(dto.contactName);
    if (contactIndex > -1) {
      user.contacts.splice(contactIndex, 1);
      await user.save();
      return user;
    } else {
      throw new BadRequestException('Contact not found');
    }
  }
}
