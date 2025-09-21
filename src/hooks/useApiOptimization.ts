import { useCallback, useRef } from "react";

/**
 * Custom hook for throttling function calls
 * Prevents excessive API calls that can cause ERR_INSUFFICIENT_RESOURCES
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (timeSinceLastCall >= delay) {
        // Execute immediately if enough time has passed
        lastCallTimeRef.current = now;
        callback(...args);
      } else {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Schedule execution after remaining delay
        const remainingDelay = delay - timeSinceLastCall;
        timeoutRef.current = setTimeout(() => {
          lastCallTimeRef.current = Date.now();
          callback(...args);
        }, remainingDelay);
      }
    },
    [callback, delay]
  );
}

/**
 * Custom hook for request retry with exponential backoff
 */
export function useRetryWithBackoff() {
  const retryRequest = useCallback(
    async <T>(
      requestFn: () => Promise<T>,
      maxRetries: number = 3,
      baseDelay: number = 1000
    ): Promise<T> => {
      let lastError: Error;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await requestFn();
        } catch (error) {
          lastError = error as Error;

          // Don't retry on the last attempt
          if (attempt === maxRetries) {
            throw lastError;
          }

          // Exponential backoff: delay increases with each retry
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    },
    []
  );

  return { retryRequest };
}

/**
 * Cache with TTL (Time To Live)
 */
class TTLCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data: value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export { TTLCache };
