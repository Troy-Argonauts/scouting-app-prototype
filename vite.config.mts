// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
console.log(packageJson.version)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: {
        transformAssetUrls,
        compilerOptions: {
            isCustomElement: tag => tag === 'qr-code'
        },
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  define: { 'APP_VERSION': `"${packageJson.version}"` },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
