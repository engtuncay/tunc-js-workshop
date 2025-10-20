import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  // Base URL for production
  base: './',
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    
    // Rollup options
    rollupOptions: {
      input: {
        main: 'index.html',
        local: 'index-local.html',
        script: 'index-script-tag.html'
      }
    }
  },
  
  // Plugins
  plugins: [
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Optimization
  optimizeDeps: {
    include: ['crypto-js']
  }
})