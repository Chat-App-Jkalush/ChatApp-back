import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '../../../../common/dto/chat.dto';
import { ChatRo } from '../../../../common/Ro/chat.ro';

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatService) {}

  @Post()
  async createChat(@Body() dto: CreateChatDto): Promise<ChatRo> {
    return this.chatService.createChat(dto);
  }
}
