import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './src/pages/login.html',
        register: './src/pages/register.html',
        dashboard: './src/pages/dashboard.html',
      }
    }
  }
})
