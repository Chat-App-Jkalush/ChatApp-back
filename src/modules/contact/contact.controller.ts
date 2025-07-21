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
import { CreateContactDto, RemoveContactDto } from '../../../../common/dto';
import { User } from '../../../../common/Ro';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  public async addContact(@Body() dto: CreateContactDto): Promise<User> {
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
  public async removeContact(@Body() dto: RemoveContactDto): Promise<User> {
    try {
      return await this.contactService.removeContact(dto);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove contact';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
