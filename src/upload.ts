/**
 * Uploads files using XMLHttpRequest for progress tracking.
 *
 * @template T - The expected response type.
 * @param {string} url - The URL to upload to.
 * @param {File[]} files - The list of files to upload.
 * @param {Object} [options] - Upload options.
 * @param {Record<string, string>} [options.headers] - Additional request headers.
 * @param {AbortSignal} [options.signal] - Signal to abort the upload.
 * @param {(p: number) => void} [options.onProgress] - Callback for upload progress (0-100).
 * @returns {Promise<T>} A promise that resolves with the response data.
 *
 * @example
 * ```ts
 * const response = await upload<UploadResult>('/api/upload', fileList, {
 *   onProgress: (percent) => console.log(`Upload: ${percent}%`)
 * });
 * ```
 */
export function upload<T>(
  url: string,
  files: File[],
  options?: {
    headers?: Record<string, string>;
    signal?: AbortSignal;
    onProgress?: (p: number) => void;
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    files.forEach((f) => fd.append('file', f));

    xhr.open('POST', url);

    Object.entries(options?.headers ?? {}).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }

    if (options?.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          options.onProgress!(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Invalid JSON'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
}
