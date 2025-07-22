import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from '../../../../common/dto/message/create-message.dto';
import { MessageResponse } from '../../../../common/ro/message/message-response.ro';
import { MessageInfoResponse } from '../../../../common/ro/message/message-info-response.ro';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  public async createMessage(
    @Body() dto: CreateMessageDto,
  ): Promise<MessageResponse> {
    return this.messageService.createMessage(dto);
  }

  @Get()
  public async getById(
    @Query('messageId') messageId: string,
    @Query('chatId') chatId: string,
  ): Promise<MessageInfoResponse> {
    return this.messageService.getById(messageId, chatId);
  }

  @Get('by-chat')
  public async getAllByChatId(
    @Query('chatId') chatId: string,
  ): Promise<MessageInfoResponse[]> {
    return this.messageService.getAllByChatId(chatId);
  }
}
