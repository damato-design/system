/// <reference types="vite/client" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['node_modules/.cache']
  },
  plugins: [react(), libInjectCss(), dts({ exclude: ['**/*.stories.tsx'] })],
  server: {watch: {usePolling: true}},
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'React-dom',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
  },
})
