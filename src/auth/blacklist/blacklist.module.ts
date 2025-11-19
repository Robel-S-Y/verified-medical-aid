import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
