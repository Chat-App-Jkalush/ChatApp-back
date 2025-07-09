import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessagesRo, GetAllChatMessagesResponse } from './Ro/chatMessages.ro';
import { CreateChatMessagesDto } from '../../../../common/dto/chatMessages.dto';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private chatMessagesService: ChatMessagesService) {}

  @Post()
  async createChatMessage(
    @Body() dto: CreateChatMessagesDto,
  ): Promise<ChatMessagesRo> {
    return this.chatMessagesService.createChatMessage(dto);
  }

  @Get()
  async getAllByChatId(
    @Query('chatId') chatId: string,
  ): Promise<GetAllChatMessagesResponse> {
    return this.chatMessagesService.getAllByChatId(chatId);
  }
}
