import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([])],
})
export class UserModule {}
