import { Module } from '@nestjs/common';
import { ChatMessagesController } from './chatMessages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatMessages,
  ChatMessagesSchema,
} from 'src/database/schemas/ChatMessages.schema';
import { ChatMessagesService } from './chatMessages.service';
import { MessagesModule } from '../message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessages.name, schema: ChatMessagesSchema },
    ]),
    MessagesModule,
  ],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
