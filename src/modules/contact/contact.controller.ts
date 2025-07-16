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
  public async addContact(@Body() dto: CreateContactDto): Promise<any> {
    return this.contactService.addContact(dto.userName, dto.contactName);
  }

  @Get('paginated')
  public async paginatedContacts(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ): Promise<{ contacts: string[]; total: number }> {
    return this.contactService.paginatedContacts(
      userName,
      Number(page),
      Number(pageSize),
    );
  }

  @Post('remove')
  public async removeContact(@Body() dto: RemoveContactDto): Promise<any> {
    try {
      return await this.contactService.removeContact(dto);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to remove contact',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
