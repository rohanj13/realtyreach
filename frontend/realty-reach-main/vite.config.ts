import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Check if public directory exists, if not, warn about it
if (!fs.existsSync(path.resolve(__dirname, 'public'))) {
  console.warn('Warning: public directory is missing. Creating empty directory...')
  fs.mkdirSync(path.resolve(__dirname, 'public'), { recursive: true })
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Set up any path aliases you were using with create-react-app
      '@': path.resolve(__dirname, './src'),
      // Add other common path aliases CRA might use
      'src': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  publicDir: 'public',
  // Configure server options (similar to create-react-app's proxy)
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    // Add better error overlay
    hmr: {
      overlay: true,
    },
  },
  // Configure build output
  build: {
    outDir: 'build',
    // Minify output for better performance
    minify: 'terser',
    sourcemap: true,
  },
  // Define environment variables similar to CRA
  define: {
    'process.env': {}
  }
})
