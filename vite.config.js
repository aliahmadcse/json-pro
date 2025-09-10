import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/json-pro/', // GitHub Pages repository name
  build: {
    outDir: 'dist',
  },
})
