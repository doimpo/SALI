import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://southasianliverinstitute.netlify.app',
  integrations: [
    sitemap(),
    compress({
      css: true,
      html: true,
      js: true,
      img: true,
      svg: true,
      htmlMinifierOptions: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true
      }
    })
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['jquery'],
            plugins: ['slick-carousel', 'fancybox']
          },
          assetFileNames: 'assets/[ext]/[name].[hash][extname]',
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js'
        }
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
