import { Model } from 'mongoose';
import {
  BadRequestException,
  Body,
  Get,
  Injectable,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/database/schemas/message.schema';
import { CommonDto, CommonRo } from '../../../../common';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  public async createMessage(
    @Body() dto: CommonDto.MessageDto.CreateMessageDto,
  ): Promise<CommonRo.MessageRo.MessageResponse> {
    const createdMessage = new this.messageModel(dto);
    const savedMessage = await createdMessage.save();

    return {
      chatId: savedMessage.chatId,
      sender: savedMessage.sender,
      content: savedMessage.content,
      createdAt: savedMessage.createdAt || new Date(),
    };
  }

  public async createAndGetId(
    @Body() dto: CommonDto.MessageDto.CreateMessageDto,
  ): Promise<string> {
    const createdMessage = new this.messageModel(dto);
    const savedMessage = await createdMessage.save();
    return savedMessage._id.toString();
  }

  public async getById(
    @Query() messageId: string,
  ): Promise<CommonRo.MessageRo.messageInfoResponse> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new BadRequestException('Message not found');
    }
    return {
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt || new Date(),
    };
  }

  public async *getAllByChatIdStream(
    chatId: string,
  ): AsyncGenerator<CommonRo.MessageRo.messageInfoResponse> {
    const cursor = this.messageModel
      .aggregate([
        { $match: { chatId } },
        { $project: { sender: 1, content: 1, createdAt: 1, _id: 0 } },
      ])
      .cursor({ batchSize: 1000 });

    try {
      for await (const document of cursor) {
        yield {
          sender: document.sender,
          content: document.content,
          createdAt: document.createdAt || new Date(),
        };
      }
    } finally {
      await cursor.close();
    }
  }
}
