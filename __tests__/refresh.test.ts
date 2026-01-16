import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refreshToken, setRefreshTokenHandler } from '../src/refresh';

describe('RefreshToken', () => {
  // We need to reset the module state potentially, but it uses file-scope variables.
  // Ideally, the module should export a way to reset, but here we can just re-set the handler.
  // Since 'refreshing' is also module-scoped, we might have side effects if not careful.
  
  beforeEach(() => {
    // Reset handler
    setRefreshTokenHandler(null as any); 
  });

  it('should throw if no handler set', async () => {
    await expect(refreshToken()).rejects.toThrow('Refresh handler not set');
  });

  it('should call the handler and return the token', async () => {
    const handler = vi.fn().mockResolvedValue('new-token');
    setRefreshTokenHandler(handler);

    const token = await refreshToken();
    expect(token).toBe('new-token');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should deduplicate multiple calls', async () => {
    let resolveHandler: (value: string) => void;
    
    const handler = vi.fn().mockImplementation(() => {
      return new Promise(resolve => {
        resolveHandler = resolve;
      });
    });
    
    setRefreshTokenHandler(handler);

    const p1 = refreshToken();
    const p2 = refreshToken();

    // Resolve the promise
    resolveHandler!('deduped-token');

    const [t1, t2] = await Promise.all([p1, p2]);

    expect(t1).toBe('deduped-token');
    expect(t2).toBe('deduped-token');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should reset refreshing state after completion', async () => {
    const handler = vi.fn().mockResolvedValue('token-1');
    setRefreshTokenHandler(handler);

    await refreshToken();
    await refreshToken(); // Should call again because first one finished

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should propagate errors from handler', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('Refresh failed'));
    setRefreshTokenHandler(handler);

    await expect(refreshToken()).rejects.toThrow('Refresh failed');
  });
});
