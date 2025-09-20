import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base public path when served in development or production
    base: '/',

    // Development server configuration
    server: {
      port: 5000,
      host: '0.0.0.0', // Allow all hosts for Replit proxy
      strictPort: true, // Exit if port is already in use
      allowedHosts: 'all', // Allow all hosts for Replit proxy compatibility
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      target: 'esnext',
    },

    // Resolve configuration
    resolve: {
      alias: {
        // Set up path aliases for cleaner imports
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@context': resolve(__dirname, 'src/context'),
        '@api': resolve(__dirname, 'src/api'),
      },
    },

    // Plugins
    plugins: [
      // React plugin
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],

    // Environment variables to be exposed to the client
    define: {
      'process.env': {},
    },
  };
});