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

  async createChat(dto: CreateChatDto): Promise<ChatRo> {
    const createdChat = new this.chatModel({
      chatName: dto.chatName,
      messages: [],
      participants: dto.participants ?? [],
    });
    const savedChat = await createdChat.save();

    return {
      chatName: savedChat.chatName,
    };
  }

  async addUserToChat(userName: string, chatId: string): Promise<ChatRo> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    if (!chat.participants.includes(userName)) {
      chat.participants.push(userName);
      await chat.save();
    }

    return {
      chatName: chat.chatName,
    };
  }
}
