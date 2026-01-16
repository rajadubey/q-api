import type { RefreshTokenHandler } from './types.js';

let handler: RefreshTokenHandler | null = null;
let refreshing: Promise<string> | null = null;

export const setRefreshTokenHandler = (fn: RefreshTokenHandler) => {
  handler = fn;
};

export async function refreshToken(): Promise<string> {
  if (!handler) {
    throw new Error('Refresh handler not set');
  }
  if (!refreshing) {
    refreshing = handler().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}
