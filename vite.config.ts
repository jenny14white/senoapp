import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // React plugin
    react(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'chart-vendor': ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true,
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: true,
  },
})