import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
}
