import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Optional: Uncomment to analyze bundle
    // Install with: npm install --save-dev rollup-plugin-visualizer
    // mode === 'analyze' && visualizer({
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ].filter(Boolean),
  build: {
    outDir: "build",

    // Optimize chunk size
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB

    rollupOptions: {
      output: {
        // Manual chunk splitting strategy
        manualChunks: {
          // React core (always needed)
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],

          // Routing libraries (needed on all pages with navigation)
          'router': ['react-router', 'react-router-dom'],

          // Animation libraries (GSAP - large, used across site)
          'animations': ['gsap', '@gsap/react', 'framer-motion'],

          // Smooth scroll library (used site-wide)
          'scroll': ['lenis'],

          // Icon libraries (lazy load if possible)
          'icons': ['react-icons', 'lucide-react'],

          // Utility library for text animations
          'text-utils': ['split-type'],
        },

        // Naming strategy for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Improve build performance
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: ['log', 'info', 'debug'], // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'gsap',
      'lenis',
    ],
  },
}));
