import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export async function createCacheConfig(configService: ConfigService) {
  try {
    const store = await redisStore({
      ttl: configService.get('CACHE_TTL'),
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_CACHE_PORT'),
      },
    });
    return {
      store,
    };
  } catch (err) {
    throw new Error(`Failed to connect to Redis instance`);
  }
}
