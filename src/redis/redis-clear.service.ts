import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisClearService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async clear(key: string) {
    await this.redis.del(`cache:${key}`);
  }
}
