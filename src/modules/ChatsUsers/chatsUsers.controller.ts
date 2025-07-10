import { Controller, Post, Body } from '@nestjs/common';
import { ChatsUsersService } from './chatsUsers.service';
import { ChatsUsersRo } from './Ro/ChatsUsers.ro';
import { CreateChatsUsersDto } from '../../../../common/dto/chatsUsers.dto';

@Controller('chats-users')
export class ChatsUsersController {
  constructor(private readonly chatsUsersService: ChatsUsersService) {}

  @Post()
  async createChatUser(
    @Body() dto: CreateChatsUsersDto,
  ): Promise<ChatsUsersRo> {
    return this.chatsUsersService.createChatUser(dto);
  }
}
