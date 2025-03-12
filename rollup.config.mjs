import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: process.env.BUILD === 'production' ? false : true,
    },
    {
      file: 'dist/es/index.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: process.env.BUILD === 'production' ? false : true,
    },
  ],
  plugins: [filesize(), nodeResolve(), typescript()],
};
