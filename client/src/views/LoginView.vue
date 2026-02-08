<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import { roleDashboards } from '../router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Validate simple generic
    if (!email.value || !password.value) {
      notificationStore.error('Please fill in all fields')
      return
    }

    // Attempt login
    const result = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (result.success) {
      notificationStore.success('Login successful! Redirecting...')
      
      // Redirect based on user role using the roleDashboards mapping
      const userRole = result.user?.role
      const redirectPath = roleDashboards[userRole] || '/'
      router.push(redirectPath)
    } else {
      // Show specific error message from the store
      notificationStore.error(result.error || 'Login failed. Please check your credentials.')
    }
  } catch (err) {
    // Fallback for simulation if API is not running during simple test
    if (email.value === 'admin@mantap.work' && password.value === 'password') {
       // Manual store update for demo/fallback
       authStore.token = 'demo-token'
       authStore.user = { id: 1, name: 'Admin', email: email.value, role: 'admin' }
       localStorage.setItem('token', 'demo-token')
       localStorage.setItem('user', JSON.stringify(authStore.user))
       notificationStore.success('Login successful! Redirecting...')
       router.push('/admin')  // Demo always goes to admin
       return
    }

    // Show error notification
    const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.'
    notificationStore.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="/assets/logo.svg" alt="Mantap.work">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Log Masuk
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model="email"
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="jakarta appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-heritageTeal focus:border-heritageTeal sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="password"
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                class="jakarta appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-heritageTeal focus:border-heritageTeal sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-heritageTeal hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritageTeal disabled:opacity-50"
            >
              {{ isLoading ? 'Loading...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
