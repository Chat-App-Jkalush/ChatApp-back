import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '../../../../common/dto/contact/create-contact.dto';
import { RemoveContactDto } from '../../../../common/dto/contact/remove-contact.dto';
import { ContactRo } from '../../../../common/ro/contact/contact.ro';
import { PaginatedContacts } from '../../../../common/ro/user/paginated-contacts.ro';
import { AddContactDto } from '../../../../common/dto/contact/add-contact.dto';
import { GetPaginatedChatsDto } from '../../../../common/dto/chat/get-paginated-chats.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  public async addContact(@Body() dto: AddContactDto): Promise<ContactRo> {
    return this.contactService.addContact(dto);
  }

  @Get('paginated')
  public async paginatedContacts(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search?: string,
  ): Promise<PaginatedContacts> {
    return this.contactService.paginatedContacts({
      userName,
      page: Number(page),
      pageSize: Number(pageSize),
      search,
    } as GetPaginatedChatsDto);
  }

  @Post('remove')
  public async removeContact(
    @Body() dto: RemoveContactDto,
  ): Promise<ContactRo> {
    try {
      return await this.contactService.removeContact(dto);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove contact';
      throw new BadRequestException(errorMessage);
    }
  }
}
