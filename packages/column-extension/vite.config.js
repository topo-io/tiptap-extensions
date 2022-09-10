import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ColumnExtension',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => `bundle.${format}.js`,
    },
  },
  plugins: [
    react(),
    dts({
      outputDir: './dist',
      insertTypesEntry: true,
    }),
  ],
});
