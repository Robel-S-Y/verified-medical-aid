import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import Redis from 'ioredis';
import { CACHE_TTL } from '../cache.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ttl = this.reflector.get<number>(CACHE_TTL, context.getHandler());
    if (!ttl) return next.handle();

    const req = context.switchToHttp().getRequest();
    if (req.method !== 'GET') return next.handle();

    const key = `cache:${req.originalUrl}`;

    const cached = await this.redis.get(key);
    if (cached) {
      console.log('➡ Serving from cache:', key);
      return of(JSON.parse(cached));
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.redis.setex(key, ttl, JSON.stringify(data));
        console.log('⬅ Cached:', key);
      }),
    );
  }
}