import { sendRequest } from '../src';

interface User {
  id: number;
  name: string;
}

async function main() {
  try {
    // Basic GET request
    const users = await sendRequest<User[]>('GET', 'https://jsonplaceholder.typicode.com/users');
    console.log('Users:', users);

    // POST request with custom headers
    const newUser = await sendRequest<User>(
      'POST',
      'https://jsonplaceholder.typicode.com/users',
      {
        headers: { 'X-Custom-Header': 'foobar' },
      },
      { name: 'John Doe' }
    );
    console.log('Created User:', newUser);

  } catch (error) {
    console.error('Request failed:', error);
  }
}

main();
