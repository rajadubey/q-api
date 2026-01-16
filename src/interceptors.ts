import type { ErrorInterceptor, RequestInterceptor, ResponseInterceptor } from './types';

export const requestInterceptors: RequestInterceptor[] = [];
export const responseInterceptors: ResponseInterceptor[] = [];
export const errorInterceptors: ErrorInterceptor[] = [];

/**
 * Adds a request interceptor.
 *
 * @param {RequestInterceptor} fn - The interceptor function.
 *
 * @example
 * ```ts
 * addRequestInterceptor(async (url, options) => {
 *   options.headers = { ...options.headers, 'X-Custom': 'value' };
 *   return [url, options];
 * });
 * ```
 */
export const addRequestInterceptor = (fn: RequestInterceptor) => requestInterceptors.push(fn);

/**
 * Adds a response interceptor.
 *
 * @param {ResponseInterceptor} fn - The interceptor function.
 *
 * @example
 * ```ts
 * addResponseInterceptor((res, data) => {
 *   console.log('Response status:', res.status);
 *   return data;
 * });
 * ```
 */
export const addResponseInterceptor = (fn: ResponseInterceptor) => responseInterceptors.push(fn);

/**
 * Adds an error interceptor.
 *
 * @param {ErrorInterceptor} fn - The interceptor function.
 *
 * @example
 * ```ts
 * addErrorInterceptor((res, error) => {
 *   console.error('Request failed:', res.status, error);
 * });
 * ```
 */
export const addErrorInterceptor = (fn: ErrorInterceptor) => errorInterceptors.push(fn);
