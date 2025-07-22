import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from 'src/database/schemas/chats.schema';
import { CreateMessageDto } from '../../../../common/dto/message/create-message.dto';
import { MessageResponse } from '../../../../common/ro/message/message-response.ro';
import { MessageInfoResponse } from '../../../../common/ro/message/message-info-response.ro';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  public async createMessage(dto: CreateMessageDto): Promise<MessageResponse> {
    const chat = await this.chatModel.findById(dto.chatId);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    const message = {
      sender: dto.sender,
      content: dto.content,
      createdAt: new Date(),
    };
    chat.messages.push(message);
    await chat.save();
    return {
      chatId: chat._id.toString(),
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
    };
  }

  public async getById(
    messageId: string,
    chatId: string,
  ): Promise<MessageInfoResponse> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    // For demo: use createdAt as a pseudo-ID (in real apps, add a unique id to each message)
    const message = chat.messages.find(
      (msg) => msg.createdAt && msg.createdAt.toISOString() === messageId,
    );
    if (!message) {
      throw new BadRequestException('Message not found');
    }
    return {
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
    };
  }

  public async getAllByChatId(chatId: string): Promise<MessageInfoResponse[]> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    return chat.messages.map((msg) => ({
      sender: msg.sender,
      content: msg.content,
      createdAt: msg.createdAt,
    }));
  }
}
