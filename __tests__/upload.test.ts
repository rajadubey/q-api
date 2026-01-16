import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { upload } from '../src/upload';

describe('upload', () => {
    let mockXhr: any;

    beforeEach(() => {
        mockXhr = {
            open: vi.fn(),
            send: vi.fn(),
            setRequestHeader: vi.fn(),
            upload: {
                onprogress: null,
            },
            status: 200,
            responseText: '{}',
        };

        // Mock global XMLHttpRequest
        global.XMLHttpRequest = vi.fn(function () {
            return mockXhr;
        }) as any;
        // Mock global FormData
        global.FormData = vi.fn(function () {
            return {
                append: vi.fn(),
            };
        }) as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should upload files using XMLHttpRequest', async () => {
        const files = [new File(['content'], 'test.txt', { type: 'text/plain' })];
        const options = { headers: { 'X-Custom': 'header' } };

        // Simulate successful load
        setTimeout(() => {
            mockXhr.onload();
        }, 0);

        await upload('/upload', files, options);

        expect(mockXhr.open).toHaveBeenCalledWith('POST', '/upload');
        expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('X-Custom', 'header');
        expect(mockXhr.send).toHaveBeenCalled();
    });

    it('should reject on network error', async () => {
        const files = [new File([''], 'test')];

        setTimeout(() => {
            mockXhr.onerror();
        }, 0);

        await expect(upload('/upload', files)).rejects.toThrow('Network error');
    });
});
