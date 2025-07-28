import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/chat': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // 👇 Tambahkan ini untuk menangani SPA routing
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
