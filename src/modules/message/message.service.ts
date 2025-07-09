import { Model } from 'mongoose';
import { Body, Get, Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/database/schemas/message.schema';
import { CreateMessageDto } from '../../../../common/dto/message.dto';
import { messageInfoResponse, MessageResponse } from './Ro/message.ro';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(@Body() dto: CreateMessageDto): Promise<MessageResponse> {
    const createdMessage = new this.messageModel(dto);
    const savedMessage = await createdMessage.save();

    return {
      chatId: savedMessage.chatId,
      sender: savedMessage.sender,
      content: savedMessage.content,
    };
  }

  async getById(@Query() messageId: string): Promise<messageInfoResponse> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new Error('Message not found');
    }
    return {
      sender: message.sender,
      content: message.content,
    };
  }
}
