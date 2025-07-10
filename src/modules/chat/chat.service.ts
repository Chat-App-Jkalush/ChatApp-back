import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/database/schemas/chats.schema';
import { CreateChatDto } from '../../../../common/dto/chat.dto';
import { ChatRo } from '../../../../common/Ro/chat.ro';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async createChat(@Body() dto: CreateChatDto): Promise<ChatRo> {
    const createdChat = new this.chatModel(dto);
    const savedChat = await createdChat.save();

    return {
      chatName: savedChat.chatName,
    };
  }
}
