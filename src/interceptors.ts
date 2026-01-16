import type { ErrorInterceptor, RequestInterceptor, ResponseInterceptor } from './types';

export const requestInterceptors: RequestInterceptor[] = [];
export const responseInterceptors: ResponseInterceptor[] = [];
export const errorInterceptors: ErrorInterceptor[] = [];

export const addRequestInterceptor = (fn: RequestInterceptor) => requestInterceptors.push(fn);

export const addResponseInterceptor = (fn: ResponseInterceptor) => responseInterceptors.push(fn);

export const addErrorInterceptor = (fn: ErrorInterceptor) => errorInterceptors.push(fn);
