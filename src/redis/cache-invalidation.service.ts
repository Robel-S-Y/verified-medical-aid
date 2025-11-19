import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheInvalidationService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async clearPrefix(prefix: string) {
    const pattern = `cache:${prefix}*`;
    const stream = this.redis.scanStream({ match: pattern });

    stream.on('data', async (keys: string[]) => {
      if (keys.length) {
        await this.redis.del(...keys);
      }
    });

    return new Promise((resolve) => stream.on('end', resolve));
  }
}
