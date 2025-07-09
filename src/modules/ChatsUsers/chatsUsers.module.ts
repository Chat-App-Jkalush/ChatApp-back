import { Module } from '@nestjs/common';
import { ChatsUsersController } from './chatsUsers.controller';
import { ChatsUsersService } from './chatsUsers.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatsUsers,
  ChatsUsersSchema,
} from 'src/database/schemas/chatsUsers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatsUsers.name,
        schema: ChatsUsersSchema,
      },
    ]),
  ],
  controllers: [ChatsUsersController],
  providers: [ChatsUsersService],
  exports: [ChatsUsersService],
})
export class ChatsUsersModule {}
