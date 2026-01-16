import { upload } from '../src';

async function main() {
    // In a browser environment, you would get this from an <input type="file">
    // For Node.js/Example purposes, we're creating a dummy file.

    if (typeof File !== 'undefined') {
        const file = new File(['Hello World'], 'hello.txt', { type: 'text/plain' });

        try {
            const response = await upload('https://api.example.com/upload', [file]);
            console.log('Upload success:', response);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    } else {
        console.log('File API not available in this environment');
    }
}

main();
