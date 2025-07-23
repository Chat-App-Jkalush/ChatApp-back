import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/schemas/users.schema';
import { RemoveContactDto } from '../../../../common/dto/contact/remove-contact.dto';
import { ContactRo } from '../../../../common/ro/contact/contact.ro';
import { PaginatedContacts } from '../../../../common/ro/user/paginated-contacts.ro';
import { CreateChatDto } from '../../../../common/dto/chat/create-chat.dto';
import { AddContactDto } from '../../../../common/dto/contact/add-contact.dto';
import { GetPaginatedUsersDto } from '../../../../common/dto/user/get-paginated-users.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async addContact(dto: AddContactDto): Promise<ContactRo> {
    const user = await this.userModel
      .findOne({ userName: dto.userName })
      .exec();
    if (!user) throw new BadRequestException('User not found');
    if (!user.contacts) user.contacts = [];
    if (!user.contacts.includes(dto.contactName)) {
      user.contacts.push(dto.contactName);
      await user.save();
    }
    return {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  public async paginatedContacts(
    dto: GetPaginatedUsersDto,
  ): Promise<PaginatedContacts> {
    const user = await this.userModel
      .findOne({ userName: dto.userName })
      .exec();
    if (!user) throw new BadRequestException('User not found');
    let contacts = user.contacts ?? [];
    if (dto.search) {
      const regex = new RegExp('^' + dto.search, 'i');
      contacts = contacts.filter((c: string) => regex.test(c));
    }
    const total = contacts.length;
    const pagedContacts = contacts.slice(
      (dto.page - 1) * dto.pageSize,
      dto.page * dto.pageSize,
    );
    return { contacts: pagedContacts, total };
  }

  public async removeContact(dto: RemoveContactDto): Promise<ContactRo> {
    const user = await this.userModel
      .findOne({ userName: dto.userName })
      .exec();
    if (!user) throw new BadRequestException('User not found');
    const contactIndex = user.contacts.indexOf(dto.contactName);
    if (contactIndex > -1) {
      user.contacts.splice(contactIndex, 1);
      await user.save();
      return {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } else {
      throw new BadRequestException('Contact not found');
    }
  }
}
