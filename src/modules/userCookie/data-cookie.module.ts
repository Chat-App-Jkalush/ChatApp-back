import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataCookie, DataCookieSchema } from './schemas/data-cookie.schema';
import { DataCookieService } from './data-cookie.service';
import { DataCookieController } from './data-cookie.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataCookie.name, schema: DataCookieSchema },
    ]),
  ],
  providers: [DataCookieService],
  controllers: [DataCookieController],
  exports: [DataCookieService],
})
export class DataCookieModule {}
