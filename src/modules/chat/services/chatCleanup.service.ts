import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/database/schemas/chats.schema';
import { Message } from 'src/database/schemas/message.schema';

@Injectable()
export class ChatCleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(ChatCleanupService.name);

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.cleanupOrphanedReferences();
    this.setupPeriodicCleanup();
  }

  public async onModuleDestroy(): Promise<void> {}

  private async cleanupOrphanedReferences(): Promise<void> {
    try {
      this.logger.log('Starting cleanup of orphaned message references...');
      const existingMessageIds = await this.messageModel.distinct('_id');
      const result = await this.chatModel.updateMany(
        {},
        {
          $pull: {
            messages: { $nin: existingMessageIds },
          },
        },
      );
      this.logger.log(
        `Cleaned up ${result.modifiedCount} chat documents with orphaned references`,
      );
    } catch (error) {
      this.logger.error('Failed to cleanup orphaned references:', error);
    }
  }

  private setupPeriodicCleanup(): void {
    this.logger.log('Setting up periodic cleanup...');
    setInterval(
      async () => {
        await this.cleanupOrphanedReferences();
      },
      30 * 60 * 1000,
    );
  }

  public async manualCleanup(): Promise<{ modifiedCount: number }> {
    const existingMessageIds = await this.messageModel.distinct('_id');
    const result = await this.chatModel.updateMany(
      {},
      {
        $pull: {
          messages: { $nin: existingMessageIds },
        },
      },
    );
    return { modifiedCount: result.modifiedCount };
  }
}
