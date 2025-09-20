// Rate limiting utility to prevent API abuse and protect against bot attacks
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs; // 1 minute window
    this.maxRequests = maxRequests; // max requests per window
  }

  // Check if request is allowed
  isAllowed(identifier: string = "default"): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    // Check if under limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  // Get remaining requests for user
  getRemainingRequests(identifier: string = "default"): number {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  // Reset requests for a user
  reset(identifier: string = "default"): void {
    this.requests.delete(identifier);
  }
}

// Create different rate limiters for different operations
export const authRateLimiter = new RateLimiter(300000, 5); // 5 auth attempts per 5 minutes
export const apiRateLimiter = new RateLimiter(60000, 100); // 100 API calls per minute
export const votingRateLimiter = new RateLimiter(300000, 10); // 10 voting actions per 5 minutes

// Supabase client wrapper with rate limiting
import { supabase } from "@/integrations/supabase/client";

export const createRateLimitedSupabaseClient = () => {
  const originalQuery = supabase.from;

  return {
    ...supabase,
    from: (table: string) => {
      const identifier = `${table}_${Date.now()}`;

      if (!apiRateLimiter.isAllowed(identifier)) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      return originalQuery.call(supabase, table);
    },
    auth: {
      ...supabase.auth,
      signInWithPassword: async (credentials: any) => {
        const identifier = `auth_${credentials.email}`;

        if (!authRateLimiter.isAllowed(identifier)) {
          throw new Error(
            "Too many login attempts. Please try again in 5 minutes."
          );
        }

        return supabase.auth.signInWithPassword(credentials);
      },
      signUp: async (credentials: any) => {
        const identifier = `signup_${credentials.email}`;

        if (!authRateLimiter.isAllowed(identifier)) {
          throw new Error(
            "Too many signup attempts. Please try again in 5 minutes."
          );
        }

        return supabase.auth.signUp(credentials);
      },
    },
  };
};

export default RateLimiter;
