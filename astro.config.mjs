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
      img: false,
      svg: false
    })
  ],
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
});
