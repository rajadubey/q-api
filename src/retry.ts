/**
 * Retries a function that returns a promise.
 *
 * @template T - The type of the result.
 * @param {() => Promise<T>} fn - The function to retry.
 * @param {number} retries - The number of times to retry.
 * @param {number} delay - The delay between retries in milliseconds.
 * @returns {Promise<T>} A promise that resolves with the result of the function.
 *
 * @example
 * ```ts
 * const result = await retry(() => fetchSomething(), 3, 1000);
 * ```
 */
export async function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}
