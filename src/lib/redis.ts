import { Redis } from '@upstash/redis';

// Initialize Redis client
// You'll need to add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env.local
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Cache utility functions
export const cacheUtils = {
  /**
   * Get cached data
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get<T>(key);
      return data;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  /**
   * Set cache with optional expiration (in seconds)
   */
  async set<T>(key: string, value: T, expirationInSeconds?: number): Promise<boolean> {
    try {
      if (expirationInSeconds) {
        await redis.setex(key, expirationInSeconds, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  /**
   * Delete cached data
   */
  async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DELETE error:', error);
      return false;
    }
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const data = await redis.mget<T[]>(...keys);
      return data;
    } catch (error) {
      console.error('Redis MGET error:', error);
      return keys.map(() => null);
    }
  },

  /**
   * Increment a counter
   */
  async increment(key: string): Promise<number> {
    try {
      const result = await redis.incr(key);
      return result;
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  },

  /**
   * Set expiration on existing key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      await redis.expire(key, seconds);
      return true;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  },
};

// Cache key generators for consistent naming
export const cacheKeys = {
  hotel: (hotelId: string) => `hotel:${hotelId}`,
  hotelSearch: (params: string) => `hotel:search:${params}`,
  userBookings: (userId: string) => `user:${userId}:bookings`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  amadeus: (endpoint: string, params: string) => `amadeus:${endpoint}:${params}`,
  session: (sessionId: string) => `session:${sessionId}`,
};

// Common cache durations (in seconds)
export const cacheDurations = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 30, // 30 minutes
  LONG: 60 * 60 * 24, // 24 hours
  WEEK: 60 * 60 * 24 * 7, // 7 days
};
