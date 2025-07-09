import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessagesRo } from './Ro/chatMessages.ro';
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
}
