import { errorInterceptors, requestInterceptors, responseInterceptors } from './interceptors.js';
import { refreshToken } from './refresh.js';
import { retry } from './retry.js';
import type { HttpMethod, RequestOptions } from './types.js';

/**
 * Sends an HTTP request.
 *
 * @template T - The expected response type.
 * @param {HttpMethod} method - The HTTP method to use (e.g., 'GET', 'POST').
 * @param {string} url - The URL to request.
 * @param {RequestOptions} [options={}] - Request configuration options.
 * @param {unknown} [body] - Optional request body.
 * @returns {Promise<T>} A promise that resolves with the response data.
 *
 * @example
 * ```ts
 * const data = await sendRequest<MyData>('GET', '/api/data', { retries: 3 });
 * ```
 */
export async function sendRequest<T>(
    method: HttpMethod,
    url: string,
    options: RequestOptions = {},
    body?: unknown
): Promise<T> {
    const { baseUrl = '', retries = 0, retryDelay = 300, signal, ...fetchOpts } = options;

    let finalUrl = baseUrl + url;
    let finalInit: RequestInit = {
        ...fetchOpts,
        method,
        body: body != null ? JSON.stringify(body) : undefined,
        headers: {
            'Content-Type': 'application/json',
            ...(fetchOpts.headers ?? {}),
        },
        signal,
    };

    for (const interceptor of requestInterceptors) {
        [finalUrl, finalInit] = await interceptor(finalUrl, finalInit);
    }

    const exec = async (): Promise<T> => {
        const res = await fetch(finalUrl, finalInit);

        let data: any;
        try {
            data = await res.json();
        } catch { }

        if (res.status === 401) {
            try {
                const token = await refreshToken();
                finalInit.headers = {
                    ...(finalInit.headers ?? {}),
                    Authorization: `Bearer ${token}`,
                };
                return exec();
            } catch { }
        }

        if (!res.ok) {
            for (const ei of errorInterceptors) {
                await ei(res, data);
            }
            throw new Error(data?.errorMessage ?? `HTTP ${res.status}`);
        }

        let result = data as T;
        for (const ri of responseInterceptors) {
            result = await ri(res, result) as T;
        }
        return result;
    };

    return retries > 0 ? retry(exec, retries, retryDelay) : exec();
}
