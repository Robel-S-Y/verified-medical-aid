import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheInvalidationService } from './cache-invalidation.service';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const client = new Redis({
      host: process.env.REDIS_URL,
      port: 6379,
      // password: '', // add if needed
    });

    client.on('connect', () => console.log('Redis connected'));
    client.on('ready', () => console.log('Redis ready'));
    client.on('error', (err) => console.log('Redis error:', err));

    return client;
  },
};

@Module({
  providers: [redisProvider, CacheInvalidationService],
  exports: ['REDIS_CLIENT', CacheInvalidationService],
})
export class RedisModule {}
