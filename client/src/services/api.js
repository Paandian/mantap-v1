import axios from 'axios'

const api = axios.create({
    // Vite uses import.meta.env with VITE_ prefix
    // Development: http://localhost:5000/api
    // Production: /api (relative to current domain)
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api
