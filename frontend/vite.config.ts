/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { splitVendorChunkPlugin } from 'vite'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true
  },
  plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin(), Icons()],
  test: {
    environment: 'jsdom'
  }
})
