import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // generate type definitions
  sourcemap: true,
  clean: true, // clean dist folder before build
  minify: false,
  splitting: false,
  target: 'es2020',
});
