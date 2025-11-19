import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class BlacklistService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async addToken(token: string, ttlSeconds = 1800) {
    await this.redis.setex(token, ttlSeconds, '1');
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const value = await this.redis.get(token);
    return value === '1';
  }
}
