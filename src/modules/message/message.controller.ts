import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from './message.service';
import { CreateMessageDto } from '../../../../common/dto/message.dto';
import { messageInfoResponse, MessageResponse } from './Ro/message.ro';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async createMessage(@Body() dto: CreateMessageDto): Promise<MessageResponse> {
    return this.messageService.createMessage(dto);
  }

  @Get()
  async getById(
    @Query('messageId') messageId: string,
  ): Promise<messageInfoResponse> {
    return this.messageService.getById(messageId);
  }

  @Get('by-chat')
  async streamAllByChatId(
    @Query('chatId') chatId: string,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    try {
      res.write('[');

      let first = true;
      for await (const message of this.messageService.getAllByChatIdStream(
        chatId,
      )) {
        if (!first) res.write(',');
        res.write(JSON.stringify(message));
        first = false;
      }

      res.write(']');
      res.end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to stream messages' });
    }
  }
}
