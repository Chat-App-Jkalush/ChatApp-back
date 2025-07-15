import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from './message.service';
import { CreateMessageDto } from '../../../../common/dto/message.dto';
import {
  messageInfoResponse,
  MessageResponse,
} from '../../../../common/Ro/message.ro';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async createMessage(@Body() dto: CreateMessageDto): Promise<MessageResponse> {
    return this.messageService.createMessage(dto);
  }

  @Get()
  async getById(
    @Query('messageId') messageId: string,
  ): Promise<messageInfoResponse> {
    return this.messageService.getById(messageId);
  }

  @Get('by-chat')
  async getAllByChatId(
    @Query('chatId') chatId: string,
  ): Promise<messageInfoResponse[]> {
    const messages: messageInfoResponse[] = [];
    for await (const message of this.messageService.getAllByChatIdStream(
      chatId,
    )) {
      messages.push(message);
    }
    return messages;
  }
}
