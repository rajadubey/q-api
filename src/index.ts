import { sendRequest } from './core.js';
import {
  addErrorInterceptor,
  addRequestInterceptor,
  addResponseInterceptor,
} from './interceptors.js';
import { setRefreshTokenHandler } from './refresh.js';
import { upload } from './upload.js';

export const api = {
  /**
   * Performs a GET request.
   *
   * @template T - The expected response type.
   * @param {string} u - The URL to request.
   * @param {any} [opts] - Optional request options.
   * @returns {Promise<T>} A promise that resolves with the response data.
   *
   * @example
   * ```ts
   * const users = await api.get<User[]>('/users');
   * ```
   */
  get: <T>(u: string, opts?: any) => sendRequest<T>('GET', u, opts),

  /**
   * Performs a POST request.
   *
   * @template T - The expected response type.
   * @param {string} u - The URL to request.
   * @param {any} [b] - The request body.
   * @param {any} [opts] - Optional request options.
   * @returns {Promise<T>} A promise that resolves with the response data.
   *
   * @example
   * ```ts
   * const newUser = await api.post<User>('/users', { name: 'Alice' });
   * ```
   */
  post: <T>(u: string, b?: any, opts?: any) => sendRequest<T>('POST', u, opts, b),

  /**
   * Performs a PUT request.
   *
   * @template T - The expected response type.
   * @param {string} u - The URL to request.
   * @param {any} [b] - The request body.
   * @param {any} [opts] - Optional request options.
   * @returns {Promise<T>} A promise that resolves with the response data.
   *
   * @example
   * ```ts
   * const updatedUser = await api.put<User>('/users/1', { name: 'Bob' });
   * ```
   */
  put: <T>(u: string, b?: any, opts?: any) => sendRequest<T>('PUT', u, opts, b),

  /**
   * Performs a PATCH request.
   *
   * @template T - The expected response type.
   * @param {string} u - The URL to request.
   * @param {any} [b] - The request body.
   * @param {any} [opts] - Optional request options.
   * @returns {Promise<T>} A promise that resolves with the response data.
   *
   * @example
   * ```ts
   * const patchedUser = await api.patch<User>('/users/1', { role: 'admin' });
   * ```
   */
  patch: <T>(u: string, b?: any, opts?: any) => sendRequest<T>('PATCH', u, opts, b),

  /**
   * Performs a DELETE request.
   *
   * @template T - The expected response type.
   * @param {string} u - The URL to request.
   * @param {any} [opts] - Optional request options.
   * @returns {Promise<T>} A promise that resolves with the response data.
   *
   * @example
   * ```ts
   * await api.delete('/users/1');
   * ```
   */
  delete: <T>(u: string, opts?: any) => sendRequest<T>('DELETE', u, opts),

  /**
   * Uploads files.
   *
   * @see {@link upload}
   */
  upload,
};

export {
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
  setRefreshTokenHandler,
};

export * from './core.js';
export * from './upload.js';
export * from './interceptors.js';
export * from './retry.js';
export * from './refresh.js';
export * from './types.js';
