import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import * as path from 'node:path'
// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PUBLIC_CI_BUILD ? '/nethook-web-analyzer/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },

  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  plugins: [react(), svgr()],
})
