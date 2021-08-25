import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/handle-image-zoom/example/dist/',
  plugins: [vue()],
})
