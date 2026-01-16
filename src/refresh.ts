import type { RefreshTokenHandler } from './types.js';

let handler: RefreshTokenHandler | null = null;
let refreshing: Promise<string> | null = null;

/**
 * Sets the handler function for refreshing tokens.
 *
 * @param {RefreshTokenHandler} fn - The function that handles token refresh.
 *
 * @example
 * ```ts
 * setRefreshTokenHandler(async () => {
 *   const newToken = await fetchNewToken();
 *   return newToken;
 * });
 * ```
 */
export const setRefreshTokenHandler = (fn: RefreshTokenHandler) => {
  handler = fn;
};

/**
 * Triggers the token refresh process.
 * If a refresh is already in progress, it returns the existing promise.
 *
 * @returns {Promise<string>} A promise that resolves with the new token.
 * @throws {Error} If the refresh handler is not set.
 */
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
