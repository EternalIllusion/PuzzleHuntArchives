import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    mkcert({
      hosts: ["me.eterill.xyz"],
      source: "coding"
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: true,
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    vue(),
    {
      name: 'copy-404',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      }
    }
  ],
  resolve:{
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  server: {
    host: '0.0.0.0',
    port: 30001,
    https: {}
  },
  build: {
    minify: "terser",
    // 打包大小警告限制
    chunkSizeWarningLimit: 1024,
    terserOptions: {
      // detail to look https://terser.org/docs/api-reference#compress-options
      compress: {
        drop_console: false,
        // 生产环境移除log
        pure_funcs: ["console.log"],
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "eleui-plus": ["element-plus"],
          "component": ["@vue/compiler-sfc"],
        },
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
