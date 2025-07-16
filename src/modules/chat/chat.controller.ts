import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '../../../../common/dto/chat.dto';
import { ChatRo } from '../../../../common/Ro/chat.ro';

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatService) {}

  @Post()
  async createChat(
    @Body() dto: CreateChatDto,
  ): Promise<{ chatId: string; chatName: string; description: string }> {
    return await this.chatService.createChat(dto);
  }

  @Post('add-user-to-chat')
  async addUserToChat(
    @Body() dto: { userName: string; chatId: string },
  ): Promise<Partial<ChatRo>> {
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
  ): Promise<{
    chats: { chatId: string; chatName: string; type: string }[];
    total: number;
  }> {
    return this.chatService.paginatedChats(
      userName,
      Number(page),
      Number(pageSize),
    );
  }

  @Get('paginated/:chatId')
  async getChatById(@Param('chatId') chatId: string) {
    return this.chatService.getChatById(chatId);
  }

  @Get('get-chat-participents/:chatId')
  async getChatUsers(
    @Param('chatId') chatId: string,
  ): Promise<{ participants: string[] }> {
    const participants = await this.chatService.getChatParticipants(chatId);
    return { participants };
  }

  @Post('leave-chat')
  async leaveChat(
    @Body() dto: { userName: string; chatId: string },
  ): Promise<boolean> {
    return this.chatService.leaveChat(dto.userName, dto.chatId);
  }
}
