import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addRequestInterceptor, addResponseInterceptor, addErrorInterceptor, requestInterceptors, responseInterceptors, errorInterceptors } from '../src/interceptors';

describe('Interceptors', () => {
    beforeEach(() => {
        requestInterceptors.length = 0;
        responseInterceptors.length = 0;
        errorInterceptors.length = 0;
    });

    it('should add request interceptor', () => {
        const interceptor = vi.fn();
        addRequestInterceptor(interceptor);
        expect(requestInterceptors).toContain(interceptor);
        expect(requestInterceptors).toHaveLength(1);
    });

    it('should add multiple request interceptors', () => {
        const i1 = vi.fn();
        const i2 = vi.fn();
        addRequestInterceptor(i1);
        addRequestInterceptor(i2);
        expect(requestInterceptors).toEqual([i1, i2]);
    });

    it('should add response interceptor', () => {
        const interceptor = vi.fn();
        addResponseInterceptor(interceptor);
        expect(responseInterceptors).toContain(interceptor);
    });

    it('should add error interceptor', () => {
        const interceptor = vi.fn();
        addErrorInterceptor(interceptor);
        expect(errorInterceptors).toContain(interceptor);
    });
});
