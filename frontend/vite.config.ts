import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    // УБЕРИТЕ middlewareMode: true, если не используете собственный сервер
    // middlewareMode предназначен для интеграции с Express/Node.js сервером
    proxy: {
      // Пример прокси для API (если нужно)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      fs: {
        allow: ['..'] // Разрешает доступ к родительским директориям
      }
    }
  }
})
