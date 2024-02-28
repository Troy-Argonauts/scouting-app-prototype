import './assets/main.css'
import {
    defineCustomElements
} from '@bitjson/qr-code'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
defineCustomElements(window)