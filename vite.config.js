import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// Get all HTML files from public directory
const htmlFiles = readdirSync('./public')
  .filter(file => file.endsWith('.html'))
  .reduce((acc, file) => {
    const name = file.replace('.html', '')
    acc[name] = resolve(__dirname, 'public', file)
    return acc
  }, {})

export default defineConfig({
  root: 'public',
  publicDir: '../src/assets',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles
    }
  },
  server: {
    port: 5173,
    open: '/index.html',
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})

