
import messages from '@intlify/unplugin-vue-i18n/messages'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/styles/main.scss'

import router from './router'

const i18n = createI18n({ locale: localStorage.getItem('lang') || 'es_ES', messages })

const app = createApp(App)

app.use(createPinia()).use(router).use(i18n).mount('#app')
