import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendRequest } from '../src/core';
import { addRequestInterceptor, addResponseInterceptor, addErrorInterceptor, requestInterceptors, responseInterceptors, errorInterceptors } from '../src/interceptors';
import { setRefreshTokenHandler } from '../src/refresh';

describe('sendRequest', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        requestInterceptors.length = 0;
        responseInterceptors.length = 0;
        errorInterceptors.length = 0;
        // Mock global fetch
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should make a successful GET request', async () => {
        const mockResponse = { data: 'test' };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });

        const result = await sendRequest('GET', '/test');

        expect(global.fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        }));
        expect(result).toEqual(mockResponse);
    });

    it('should make a successful POST request with body', async () => {
        const mockResponse = { id: 1 };
        const requestBody = { name: 'test' };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 201,
            json: async () => mockResponse,
        });

        const result = await sendRequest('POST', '/users', {}, requestBody);

        expect(global.fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(requestBody),
        }));
        expect(result).toEqual(mockResponse);
    });

    it('should merge headers correctly', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        await sendRequest('GET', '/test', {
            headers: { 'X-Custom': 'value' },
        });

        expect(global.fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
                'X-Custom': 'value',
            }),
        }));
    });

    it('should handle non-OK responses', async () => {
        const errorResponse = { errorMessage: 'Bad Request' };
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => errorResponse,
        });

        await expect(sendRequest('GET', '/test')).rejects.toThrow('Bad Request');
    });

    it('should run request interceptors', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        addRequestInterceptor((url, options) => {
            const newOptions = { ...options, headers: { ...options.headers, 'X-Intercepted': 'true' } };
            return [url + '?intercepted=true', newOptions];
        });

        await sendRequest('GET', '/test');

        expect(global.fetch).toHaveBeenCalledWith(
            '/test?intercepted=true',
            expect.objectContaining({
                headers: expect.objectContaining({ 'X-Intercepted': 'true' }),
            })
        );
    });

    it('should run response interceptors', async () => {
        const originalResponse = { data: 'original' };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => originalResponse,
        });

        addResponseInterceptor(async (res, data) => {
            return { ...(data as any), modified: true };
        });

        const result = await sendRequest('GET', '/test');
        expect(result).toEqual({ data: 'original', modified: true });
    });

    it('should handle 401 and refresh token', async () => {
        const successResponse = { data: 'success' };

        // First call fails with 401
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({}),
        });

        // Second call succeeds
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => successResponse,
        });

        const refreshHandler = vi.fn().mockResolvedValue('new-token');
        setRefreshTokenHandler(refreshHandler);

        const result = await sendRequest('GET', '/protected');

        expect(refreshHandler).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenLastCalledWith(
            '/protected',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer new-token',
                }),
            })
        );
        expect(result).toEqual(successResponse);
    });
});
