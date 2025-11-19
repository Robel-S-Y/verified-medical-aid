import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [CacheModule.register()],
  providers: [BlacklistService],
  exports: [BlacklistService], // export so AuthModule can use it
})
export class BlacklistModule {}
