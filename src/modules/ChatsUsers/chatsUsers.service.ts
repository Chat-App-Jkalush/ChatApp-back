import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatsUsers } from 'src/database/schemas/chatsUsers.schema';
import { CreateChatsUsersDto } from '../../../../common/dto/chatsUsers.dto';
import { ChatsUsersRo } from './Ro/ChatsUsers.ro';

@Injectable()
export class ChatsUsersService {
  constructor(
    @InjectModel(ChatsUsers.name)
    private readonly chatsUsersModel: Model<ChatsUsers>,
  ) {}

  async createChatUser(
    @Body() dto: CreateChatsUsersDto,
  ): Promise<ChatsUsersRo> {
    const createdChatUser = new this.chatsUsersModel(dto);
    const savedChatUser = await createdChatUser.save();
    return {
      chatId: savedChatUser.chatId,
      userId: savedChatUser.userId,
    };
  }
}
