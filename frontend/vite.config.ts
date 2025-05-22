import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.bizkit.dukcode.org',
        changeOrigin: true,
        secure: false,
        // 타깃 서버에 도달하는 요청 경로에서 /api 제거
        rewrite: (path) => path.replace(/^\/api/, ''),
        // CORS 인증 관련 설정
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        // OPTIONS 요청 처리
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // 디버깅용 - 요청 헤더 로깅
            console.log('Proxy Request Headers:', req.headers);
          });
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy Error:', err);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`Proxy Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
          });
        },
      },
    },
  },
});
