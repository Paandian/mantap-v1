import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize auth store before mounting
const authStore = useAuthStore()
authStore.initializeAuth()

// Check session periodically (every 5 minutes)
setInterval(() => {
  authStore.checkSession()
}, 5 * 60 * 1000)

app.mount('#app')
