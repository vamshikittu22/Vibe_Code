import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base public path when served in development or production
    base: '/',

    // Development server configuration
    server: {
      port: 3000,
      host: true, // Listen on all network interfaces
      open: true, // Open browser on server start
      strictPort: true, // Exit if port is already in use
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // WebSocket proxy for development
        '/socket.io': {
          target: 'ws://localhost:5000',
          ws: true,
        },
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      target: 'esnext',
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries into separate chunks
            react: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            // Split code-splitting for better caching
            codeEditor: ['@monaco-editor/react', 'monaco-editor'],
          },
        },
      },
      // Terser options for production builds
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },

    // Global CSS configuration
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`,
        },
      },
    },

    // Resolve configuration
    resolve: {
      alias: {
        // Set up path aliases for cleaner imports
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@context': resolve(__dirname, 'src/context'),
        '@api': resolve(__dirname, 'src/api'),
      },
    },

    // Plugins
    plugins: [
      // React plugin with fast refresh
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),

      // HTML plugin for injecting variables into index.html
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'VIbeCode',
            description: 'AI-Powered Code Editor',
            themeColor: '#3f51b5',
          },
        },
      }),

      // PWA support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'VIbeCode',
          short_name: 'VIbeCode',
          description: 'AI-Powered Code Editor',
          theme_color: '#3f51b5',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),

      // Image optimization
      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          lossless: true,
        },
      }),

      // Bundle analyzer (only in report mode)
      mode === 'report' &&
        visualizer({
          open: true,
          filename: 'dist/bundle-analysis.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    // Environment variables to be exposed to the client
    define: {
      'process.env': {},
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version || '0.1.0'),
    },
  };
});
