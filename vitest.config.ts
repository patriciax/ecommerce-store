import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import { dirname, resolve } from 'node:path'
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url))
    },
    plugins: [
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/assets/locales/**'),
      }),
    ],
  })
)
