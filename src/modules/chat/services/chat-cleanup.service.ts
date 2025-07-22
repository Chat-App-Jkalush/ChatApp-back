import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/database/schemas/chats.schema';
import { BackendConstants } from 'src/constants/backend.constants';

@Injectable()
export class ChatCleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(ChatCleanupService.name);

  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  public async onModuleInit(): Promise<void> {
    await this.cleanupExpiredMessages();
    this.setupPeriodicCleanup();
  }

  public async onModuleDestroy(): Promise<void> {}

  private async cleanupExpiredMessages(): Promise<void> {
    try {
      this.logger.log('Starting cleanup of expired embedded messages...');
      const expiryDate = new Date(
        Date.now() - BackendConstants.MessageConstants.EXPIRES_IN * 1000,
      );
      const chats = await this.chatModel.find({
        'messages.createdAt': { $lt: expiryDate },
      });
      let totalRemoved = 0;
      for (const chat of chats) {
        const before = chat.messages.length;
        chat.messages = chat.messages.filter(
          (msg) => msg.createdAt > expiryDate,
        );
        const removed = before - chat.messages.length;
        totalRemoved += removed;
        if (removed > 0) {
          await chat.save();
        }
      }
      this.logger.log(
        `Cleaned up ${totalRemoved} expired messages from chats.`,
      );
    } catch (error) {
      this.logger.error('Failed to cleanup expired embedded messages:', error);
    }
  }

  private setupPeriodicCleanup(): void {
    this.logger.log('Setting up periodic cleanup for expired messages...');
    setInterval(
      async () => {
        await this.cleanupExpiredMessages();
      },
      60 * 60 * 1000, // every hour
    );
  }

  public async manualCleanup(): Promise<{ totalRemoved: number }> {
    const expiryDate = new Date(
      Date.now() - BackendConstants.MessageConstants.EXPIRES_IN * 1000,
    );
    const chats = await this.chatModel.find({
      'messages.createdAt': { $lt: expiryDate },
    });
    let totalRemoved = 0;
    for (const chat of chats) {
      const before = chat.messages.length;
      chat.messages = chat.messages.filter((msg) => msg.createdAt > expiryDate);
      const removed = before - chat.messages.length;
      totalRemoved += removed;
      if (removed > 0) {
        await chat.save();
      }
    }
    return { totalRemoved };
  }
}
