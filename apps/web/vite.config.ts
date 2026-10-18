import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      // React Query and Base UI ship "use client"; it is meaningless in an SPA.
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning)
      },
    },
  },
})
