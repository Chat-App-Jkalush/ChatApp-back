import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  AddUserToChatDto,
  CreateChatDto,
  DmExitsDto,
  LeaveChatDto,
  UpdateUserChats,
} from '../../../../common/dto/chat.dto';
import { ChatRo } from '../../../../common/Ro/chat.ro';

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatService) {}

  @Post()
  async createChat(@Body() dto: CreateChatDto): Promise<ChatRo> {
    return await this.chatService.createChat(dto);
  }

  @Post('add-user-to-chat')
  async addUserToChat(@Body() dto: AddUserToChatDto): Promise<Partial<ChatRo>> {
    return this.chatService.addUserToChat(dto.userName, dto.chatId);
  }

  @Post('update-user-chats')
  async updateUserChats(@Body() dto: UpdateUserChats): Promise<void> {
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
  async leaveChat(@Body() dto: LeaveChatDto): Promise<boolean> {
    return this.chatService.leaveChat(dto.userName, dto.chatId);
  }

  @Post('dm-exists')
  async dmExists(@Body() dto: DmExitsDto): Promise<boolean> {
    return this.chatService.dmExists(dto);
  }

  @Post('delete-dm')
  async deleteDm(@Body() dto: DmExitsDto): Promise<{ message: string }> {
    return this.chatService.deleteDm(dto);
  }
}
