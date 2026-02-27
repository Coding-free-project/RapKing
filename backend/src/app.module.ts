import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { ArtistsModule } from './artists/artists.module';
import { ClipsModule } from './clips/clips.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { ContactModule } from './contact/contact.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    ArticlesModule,
    ArtistsModule,
    ClipsModule,
    AdvertisementsModule,
    ContactModule,
    SearchModule,
    UploadModule,
  ],
})
export class AppModule {}
