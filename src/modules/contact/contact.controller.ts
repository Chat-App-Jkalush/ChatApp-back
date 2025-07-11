import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  async addContact(@Body() body: { userName: string; contactName: string }) {
    return this.contactService.addContact(body.userName, body.contactName);
  }

  @Get('paginated')
  async paginatedContacts(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.contactService.paginatedContacts(
      userName,
      Number(page),
      Number(pageSize),
    );
  }
}
