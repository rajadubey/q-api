import { sendRequest } from './core.js';
import {
  addErrorInterceptor,
  addRequestInterceptor,
  addResponseInterceptor,
} from './interceptors.js';
import { setRefreshTokenHandler } from './refresh.js';
import { upload } from './upload.js';

export const api = {
  get: <T>(u: string, opts?: any) => sendRequest<T>('GET', u, opts),
  post: <T>(u: string, b?: any, opts?: any) => sendRequest<T>('POST', u, opts, b),
  put: <T>(u: string, b?: any, opts?: any) => sendRequest<T>('PUT', u, opts, b),
  patch: <T>(u: string, b?: any, opts?: any) => sendRequest<T>('PATCH', u, opts, b),
  delete: <T>(u: string, opts?: any) => sendRequest<T>('DELETE', u, opts),
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
