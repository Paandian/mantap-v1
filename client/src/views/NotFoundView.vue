<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full text-center">
      <!-- 404 Animation -->
      <div class="relative mb-8">
        <div class="text-9xl font-black text-indigo-100 select-none absolute inset-0 flex items-center justify-center">
          404
        </div>
        <div class="relative z-10">
          <svg class="mx-auto h-32 w-32 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4 font-jakarta">
        Page Not Found
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Oops! The page you're looking for seems to have wandered off. 
        It might have been moved, deleted, or never existed.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goHome"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Home
        </button>
        <button
          @click="goBack"
          class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">Need help? Try these:</p>
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <router-link to="/" class="text-indigo-600 hover:text-indigo-500 font-medium">
            Home
          </router-link>
          <span class="text-gray-300">|</span>
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">
            Login
          </router-link>
          <span class="text-gray-300">|</span>
          <a href="mailto:support@mantap.work" class="text-indigo-600 hover:text-indigo-500 font-medium">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
