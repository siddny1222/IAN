import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [react()],
    build: {
      assetsInlineLimit: 4096,
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('react-router-dom') || id.includes('/react-dom/') || id.includes('/react/')) {
              return 'react-vendor'
            }

            return undefined
          },
        },
      },
    },
  }
})
