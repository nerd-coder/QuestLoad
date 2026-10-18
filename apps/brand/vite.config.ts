import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: { alias: { '@': '/src' } },
  build: {
    rollupOptions: {
      // Base UI ships "use client" in every module; it is meaningless in an SPA.
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning)
      },
    },
  },
})
