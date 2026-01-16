export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = Omit<RequestInit, 'body'> & {
  baseUrl?: string;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
};

export type RequestInterceptor = (
  url: string,
  options: RequestInit
) => Promise<[string, RequestInit]> | [string, RequestInit];

export type ResponseInterceptor<T = unknown> = (response: Response, data: T) => Promise<T> | T;

export type ErrorInterceptor = (response: Response, data?: unknown) => Promise<void> | void;

export type RefreshTokenHandler = () => Promise<string>;
