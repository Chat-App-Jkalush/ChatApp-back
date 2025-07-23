import { Module } from '@nestjs/common';
import { ChatsController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chats.schema';
import { User, UserSchema } from 'src/modules/user/schemas/users.schema';
import { ChatGateway } from './services/gateways/chat-gateway';
import { ChatCleanupService } from './services/chat-cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatService, ChatGateway, ChatCleanupService],
  exports: [ChatService],
})
export class ChatModule {}
