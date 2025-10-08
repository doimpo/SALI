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
  publicDir: false, // Disable automatic public directory handling
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles
    },
    assetsInlineLimit: 0, // Don't inline any assets
    copyPublicDir: false, // Don't copy public dir automatically
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
  },
  plugins: [
    {
      name: 'copy-assets',
      writeBundle() {
        const { cpSync } = require('fs')
        const { join } = require('path')
        // Copy the entire assets folder to dist
        cpSync(
          join(__dirname, 'public', 'assets'),
          join(__dirname, 'dist', 'assets'),
          { recursive: true }
        )
      }
    }
  ]
})

