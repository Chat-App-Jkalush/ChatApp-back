import { Body, Controller, Post, Get, Query } from '@nestjs/common';
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

  @Post('add-user-to-chat')
  async addUserToChat(
    @Body() dto: { userName: string; chatId: string },
  ): Promise<ChatRo> {
    return this.chatService.addUserToChat(dto.userName, dto.chatId);
  }

  @Post('update-user-chats')
  async updateUserChats(
    @Body() dto: { userName: string; chatId: string; chatName: string },
  ): Promise<void> {
    return this.chatService.updateUserChats(
      dto.userName,
      dto.chatId,
      dto.chatName,
    );
  }

  @Get('paginated')
  async paginatedChats(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.chatService.paginatedChats(
      userName,
      Number(page),
      Number(pageSize),
    );
  }
}
