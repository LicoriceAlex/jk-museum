import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_URL = env.PUBLIC_API_URL || 'http://localhost:8000'

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/variables.css";'
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src/styles')
      }
    },
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      watch: { usePolling: true, interval: 100 },
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
          // если бэкенд НЕ имеет префикса /api — уберём его на прокси:
          rewrite: (p) => p.replace(/^\/api/, ''),
          // если есть вебсокеты на /api/ws — раскомментируй:
          // ws: true
        }
      },
      fs: { allow: ['..'] }
    }
  }
})
