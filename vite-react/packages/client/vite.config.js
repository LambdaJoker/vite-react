import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // 开启 gzip 压缩
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240, // 体积大于 10KB 才压缩
            algorithm: 'gzip',
            ext: '.gz',
        }),
        // 构建产物分析（只有在设置了特定的环境变量时才开启，避免影响平时构建速度）
        process.env.ANALYZE === 'true' && visualizer({
            open: true, // 注意：打包后自动打开分析页面
            filename: 'stats.html',
            gzipSize: true,
            brotliSize: true,
        })
    ].filter(Boolean),
    base: './',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                // 自动分包：将 node_modules 中的依赖分别打包
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@mui') || id.includes('@emotion')) {
                            return 'vendor-mui';
                        }
                        if (id.includes('framer-motion')) {
                            return 'vendor-framer';
                        }
                        if (id.includes('react-markdown') || id.includes('react-syntax-highlighter') || id.includes('remark') || id.includes('rehype')) {
                            return 'vendor-markdown';
                        }
                        // 其他的库都打包到 vendor
                        return 'vendor-others';
                    }
                },
                // 配置文件分类，保持输出目录整洁
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            }
        }
    },
    esbuild: {
        drop: ['console', 'debugger'],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
});
