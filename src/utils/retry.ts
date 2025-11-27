/**
 * Retry utility for handling network and authentication errors
 */

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: Error) => boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryCondition: (error: Error) => {
    // Retry on network errors, timeouts, and specific server errors
    return error.message.includes('fetch') ||
           error.message.includes('timeout') ||
           error.message.includes('NetworkError') ||
           error.message.includes('500') ||
           error.message.includes('502') ||
           error.message.includes('503') ||
           error.message.includes('504');
  }
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on the last attempt
      if (attempt === opts.maxRetries) {
        throw lastError;
      }

      // Check if we should retry this error
      if (opts.retryCondition && !opts.retryCondition(lastError)) {
        throw lastError;
      }

      // Call onRetry callback if provided
      if (opts.onRetry) {
        opts.onRetry(attempt + 1, lastError);
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.backoffFactor, attempt),
        opts.maxDelay
      );

      console.log(`🔄 Retry attempt ${attempt + 1}/${opts.maxRetries} after ${delay}ms: ${lastError.message}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Specific retry configuration for authentication operations
 */
export const authRetryOptions: Partial<RetryOptions> = {
  maxRetries: 2,
  baseDelay: 500,
  backoffFactor: 1.5,
  retryCondition: (error: Error) => {
    // Retry on network issues but not on authentication failures
    return !error.message.includes('401') &&
           !error.message.includes('403') &&
           !error.message.includes('Unauthorized') &&
           !error.message.includes('gått ut') &&
           !error.message.includes('logga in') &&
           (error.message.includes('fetch') ||
            error.message.includes('timeout') ||
            error.message.includes('NetworkError') ||
            error.message.includes('500'));
  },
  onRetry: (attempt, error) => {
    console.log(`🔐 Auth retry ${attempt}: ${error.message}`);
  }
};

/**
 * Specific retry configuration for data operations
 */
export const dataRetryOptions: Partial<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  backoffFactor: 2,
  retryCondition: (error: Error) => {
    // Retry on network and server errors, but not on 404 (data not found)
    return !error.message.includes('404') &&
           !error.message.includes('hittades inte') &&
           (error.message.includes('fetch') ||
            error.message.includes('timeout') ||
            error.message.includes('NetworkError') ||
            error.message.includes('500') ||
            error.message.includes('502') ||
            error.message.includes('503'));
  },
  onRetry: (attempt, error) => {
    console.log(`📊 Data retry ${attempt}: ${error.message}`);
  }
};

/**
 * Circuit breaker pattern for API endpoints
 */
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold = 5,
    private recoveryTimeout = 30000 // 30 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
        console.log('🔄 Circuit breaker: HALF_OPEN - testing...');
      } else {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    if (this.state === 'HALF_OPEN') {
      console.log('✅ Circuit breaker: CLOSED - service recovered');
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log('🚫 Circuit breaker: OPEN - service temporarily disabled');
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Global circuit breaker for API calls
export const apiCircuitBreaker = new CircuitBreaker(3, 15000); // 3 failures, 15s recovery