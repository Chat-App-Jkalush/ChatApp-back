import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserCookie,
  UserCookieSchema,
} from 'src/database/schemas/userCookie.schema';
import { UserCookieService } from './userCookie.service';
import { UserCookieController } from './userCookie.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCookie.name, schema: UserCookieSchema },
    ]),
  ],
  providers: [UserCookieService],
  controllers: [UserCookieController],
  exports: [UserCookieService],
})
export class UserCookieModule {}
