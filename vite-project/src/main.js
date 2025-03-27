import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './plugins/axios'
import './style.css'

// Configurar axios
axios.defaults.baseURL = 'http://localhost:5000'
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const app = createApp(App)

app.config.globalProperties.$axios = axios
app.use(router)
app.mount('#app')
