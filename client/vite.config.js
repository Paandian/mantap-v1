import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 8080,
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API_BASE || 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
