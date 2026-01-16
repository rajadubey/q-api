import { sendRequest, addRequestInterceptor, addResponseInterceptor } from '../src';

// Add a logging interceptor for requests
addRequestInterceptor((url, options) => {
  console.log(`[REQUEST] ${options.method} ${url}`);
  return [url, options];
});

// Add a response interceptor
addResponseInterceptor(async (res, data) => {
  console.log(`[RESPONSE] Status: ${res.status}`);
  return data;
});

async function main() {
  try {
    await sendRequest('GET', 'https://jsonplaceholder.typicode.com/todos/1');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
