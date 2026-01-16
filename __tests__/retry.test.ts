import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from '../src/retry';

describe('retry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return result immediately if function succeeds', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retry(fn, 3, 100);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry if function fails', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const promise = retry(fn, 3, 100);

    // Fast-forward time for the delay
    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should fail after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));

    const promise = retry(fn, 2, 100);

    // Attach the expectation immediately to handle the future rejection
    const validation = expect(promise).rejects.toThrow('fail');

    // 1st retry
    await vi.advanceTimersByTimeAsync(100);
    // 2nd retry
    await vi.advanceTimersByTimeAsync(200);

    await validation;
    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  // Checking retry.ts implementation for backoff strategy.
  // Code says: retry(fn, retries - 1, delay * 2); -> yes, exponential backoff.
});
