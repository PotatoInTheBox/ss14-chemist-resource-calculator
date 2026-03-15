import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@data': path.resolve(__dirname, 'src/data'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@model': path.resolve(__dirname, 'src/model'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@ui/cards': path.resolve(__dirname, 'src/ui/cards'),
      '@hooks': path.resolve(__dirname, 'src/hooks')
    }
  },
})
