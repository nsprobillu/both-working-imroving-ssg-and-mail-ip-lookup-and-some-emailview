import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'fs';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Read sitemap content
const sitemap = fs.readFileSync(path.resolve(__dirname, 'public/sitemap.xml'), 'utf-8');

export default defineConfig({
  plugins: [
    react({
      // Exclude sitemap.xml from React routing
      exclude: ['**/sitemap.xml']
    }),
    visualizer(),
    viteStaticCopy({
      targets: [
        {
          src: 'dist/index.html',
          dest: 'dist',
          transform: (contents) => {
            // Add meta tags for SEO
            return contents.replace(
              '</head>',
              `<meta name="description" content="Create free temporary email addresses instantly. Valid for 48 hours with option to extend up to 2+ months. No registration required." />
              <meta name="keywords" content="temporary email, disposable email, temp mail, email generator, free email, spam protection" />
              <meta name="author" content="Boomlify" />
              <meta name="robots" content="index, follow" />
              <meta property="og:title" content="Boomlify - Temporary Email Service" />
              <meta property="og:description" content="Create free temporary email addresses instantly. Valid for 48 hours with option to extend up to 2+ months. No registration required." />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="%VITE_FRONTEND_URL%" />
              <meta property="og:image" content="%VITE_FRONTEND_URL%/og-image.jpg" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="Boomlify - Temporary Email Service" />
              <meta name="twitter:description" content="Create free temporary email addresses instantly. Valid for 48 hours with option to extend up to 2+ months. No registration required." />
              <meta name="twitter:image" content="%VITE_FRONTEND_URL%/og-image.jpg" />
              <link rel="canonical" href="%VITE_FRONTEND_URL%" />
              </head>`
            );
          }
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Add cache busting to file names
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
          utils: ['axios', 'zustand']
        }
      },
      input: {
        main: 'index.html'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    // Optimize for static generation
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    middlewares: [
      {
        name: 'serve-sitemap',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/sitemap.xml') {
              res.setHeader('Content-Type', 'application/xml');
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              res.end(sitemap);
            } else {
              next();
            }
          });
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  }
});