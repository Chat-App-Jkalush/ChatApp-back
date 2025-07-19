import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CommonDto, CommonRo } from '../../../../common';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  public async createMessage(
    @Body() dto: CommonDto.MessageDto.CreateMessageDto,
  ): Promise<CommonRo.MessageRo.MessageResponse> {
    return this.messageService.createMessage(dto);
  }

  @Get()
  public async getById(
    @Query('messageId') messageId: string,
  ): Promise<CommonRo.MessageRo.messageInfoResponse> {
    return this.messageService.getById(messageId);
  }

  @Get('by-chat')
  public async getAllByChatId(
    @Query('chatId') chatId: string,
  ): Promise<CommonRo.MessageRo.messageInfoResponse[]> {
    const messages: CommonRo.MessageRo.messageInfoResponse[] = [];
    for await (const message of this.messageService.getAllByChatIdStream(
      chatId,
    )) {
      messages.push(message);
    }
    return messages;
  }
}
