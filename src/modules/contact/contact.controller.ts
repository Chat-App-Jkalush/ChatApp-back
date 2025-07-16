import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  CreateContactDto,
  RemoveContactDto,
} from '../../../../common/dto/contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  async addContact(@Body() dto: CreateContactDto) {
    return this.contactService.addContact(dto.userName, dto.contactName);
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

  @Post('remove')
  async removeContact(@Body() dto: RemoveContactDto) {
    try {
      return await this.contactService.removeContact(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to remove contact',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
