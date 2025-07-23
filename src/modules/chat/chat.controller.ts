import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '../../../../common/dto/chat/create-chat.dto';
import { AddUserToChatDto } from '../../../../common/dto/chat/add-user-to-chat.dto';
import { UpdateUserChats } from '../../../../common/dto/chat/update-user-chats.dto';
import { LeaveChatDto } from '../../../../common/dto/chat/leave-chat.dto';
import { ChatRo } from '../../../../common/ro/chat/chat.ro';
import { PaginatedChatsRo } from '../../../../common/ro/chat/paginated-chats.ro';
import { MessageInfoResponse } from '../../../../common/ro/message/message-info-response.ro';
import { DeleteDmResponseRo } from '../../../../common/ro/chat/delete-dm-response.ro';
import { EmbeddedMessage } from 'src/modules/chat/schemas/embedded-message.schema';
import { DmExistsDto } from '../../../../common/dto/chat/dm-exists.dto';
import { GetPaginatedChatsDto } from '../../../../common/dto/chat/get-paginated-chats.dto';
import { CreateMessageDto } from '../../../../common/dto/message/create-message.dto';

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
    return this.chatService.paginatedChats({
      userName,
      page: Number(page),
      pageSize: Number(pageSize),
      search,
    } as GetPaginatedChatsDto);
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
  public async dmExists(@Body() dto: DmExistsDto): Promise<boolean> {
    return this.chatService.dmExists(dto);
  }

  @Post('delete-dm')
  public async deleteDm(@Body() dto: DmExistsDto): Promise<DeleteDmResponseRo> {
    return this.chatService.deleteDm(dto);
  }

  @Get(':chatId/messages')
  public async getChatMessages(@Param('chatId') chatId: string) {
    const chat = await this.chatService.getChatById(chatId);
    if (!chat) return [];
    return chat.messages || [];
  }

  @Post(':chatId/messages')
  public async addMessageToChat(
    @Param('chatId') chatId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<EmbeddedMessage> {
    return this.chatService.addMessageToChat({
      chatId,
      sender: dto.sender,
      content: dto.content,
    } as CreateMessageDto);
  }
}
