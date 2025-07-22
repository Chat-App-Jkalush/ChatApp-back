import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '../../../../common/dto/chat/create-chat.dto';
import { AddUserToChatDto } from '../../../../common/dto/chat/add-user-to-chat.dto';
import { UpdateUserChats } from '../../../../common/dto/chat/update-user-chats.dto';
import { LeaveChatDto } from '../../../../common/dto/chat/leave-chat.dto';
import { DmExitsDto } from '../../../../common/dto/chat/dm-exists.dto';
import { ChatRo } from '../../../../common/ro/chat/chat.ro';
import { PaginatedChatsRo } from '../../../../common/ro/chat/paginated-chats.ro';

@Controller('chats')
export class ChatsController {
  constructor(private chatService: ChatService) {}

  @Post()
  public async createChat(@Body() dto: CreateChatDto): Promise<ChatRo> {
    console.log('Creating chat with DTO:', dto);
    return await this.chatService.createChat(dto);
  }

  @Post('add-user-to-chat')
  public async addUserToChat(
    @Body() dto: AddUserToChatDto,
  ): Promise<Partial<ChatRo>> {
    return this.chatService.addUserToChat(dto.userName, dto.chatId);
  }

  @Post('update-user-chats')
  public async updateUserChats(@Body() dto: UpdateUserChats): Promise<void> {
    return this.chatService.updateUserChats(dto.userName);
  }

  @Get('paginated')
  public async paginatedChats(
    @Query('userName') userName: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search?: string,
  ): Promise<PaginatedChatsRo> {
    return this.chatService.paginatedChats(
      userName,
      Number(page),
      Number(pageSize),
      search,
    );
  }

  @Get('paginated/:chatId')
  public async getChatById(@Param('chatId') chatId: string): Promise<any> {
    return this.chatService.getChatById(chatId);
  }

  @Get('get-chat-participents/:chatId')
  public async getChatUsers(
    @Param('chatId') chatId: string,
  ): Promise<{ participants: string[] }> {
    const participants = await this.chatService.getChatParticipants(chatId);
    return { participants };
  }

  @Post('leave-chat')
  public async leaveChat(@Body() dto: LeaveChatDto): Promise<boolean> {
    return this.chatService.leaveChat(dto.userName, dto.chatId);
  }

  @Post('dm-exists')
  public async dmExists(@Body() dto: DmExitsDto): Promise<boolean> {
    return this.chatService.dmExists(dto);
  }

  @Post('delete-dm')
  public async deleteDm(@Body() dto: DmExitsDto): Promise<{ message: string }> {
    return this.chatService.deleteDm(dto);
  }
}
