import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '../../../../common/dto/contact.dto';
import { ContactRo, GetAllContactsResponse } from './Ro/contact.ro';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(@Body() dto: CreateContactDto): Promise<ContactRo> {
    return this.contactService.createContact(dto);
  }

  @Get()
  async getAllUserContacts(
    @Query('userName') userName: string,
  ): Promise<GetAllContactsResponse> {
    return this.contactService.getAllUserContacts(userName);
  }
}
