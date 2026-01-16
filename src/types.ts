/**
 * Supported HTTP methods.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Options for making a request.
 */
export type RequestOptions = Omit<RequestInit, 'body'> & {
  /** Base URL to prepend to the request URL. */
  baseUrl?: string;
  /** Number of retry attempts for failed requests. */
  retries?: number;
  /** Delay in milliseconds between retries. */
  retryDelay?: number;
  /** Signal to abort the request. */
  signal?: AbortSignal;
};

/**
 * Interceptor for HTTP requests.
 * Can modify the URL and options before the request is sent.
 */
export type RequestInterceptor = (
  url: string,
  options: RequestInit
) => Promise<[string, RequestInit]> | [string, RequestInit];

/**
 * Interceptor for HTTP responses.
 * Processes the response after it has been received and parsed.
 */
export type ResponseInterceptor<T = unknown> = (response: Response, data: T) => Promise<T> | T;

/**
 * Interceptor for HTTP errors.
 * Executed when the response status indicates an error (e.g., non-2xx).
 */
export type ErrorInterceptor = (response: Response, data?: unknown) => Promise<void> | void;

/**
 * Handler for refreshing authentication tokens.
 * Should return a promise that resolves with the new token.
 */
export type RefreshTokenHandler = () => Promise<string>;
