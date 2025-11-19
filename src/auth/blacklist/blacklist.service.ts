import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class BlacklistService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async addToken(token: string) {
    await this.cache.set(token, true, 1800);
  }

  async isBlacklisted(token: string) {
    const v = await this.cache.get(token);
    console.log('isBlacklisted check:', token, v);
    return !!v;
  }
}
