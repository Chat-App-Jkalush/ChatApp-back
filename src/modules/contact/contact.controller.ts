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
import { CommonDto, CommonRo } from '../../../../common';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('add')
  public async addContact(
    @Body() dto: CommonDto.ContactDto.CreateContactDto,
  ): Promise<CommonRo.UserRo.User> {
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
  public async removeContact(
    @Body() dto: CommonDto.ContactDto.RemoveContactDto,
  ): Promise<CommonRo.UserRo.User> {
    try {
      return await this.contactService.removeContact(dto);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove contact';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
