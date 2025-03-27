/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  root: '.',
  server: {
    port: 3001,
    open: true,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: 'src/embed.tsx',
      name: 'ChatbotA',
      formats: ['umd'],
      fileName: () => 'chatbot.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        inlineDynamicImports: true,
        assetFileNames: 'chatbot.js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    exclude: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/__tests__/**',
      '**/test/**'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}); 