import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Keep the map (Leaflet) out of the main/home chunk.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('leaflet')) return 'map'
        },
      },
    },
  },
})
