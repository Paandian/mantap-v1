<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <NavBar />
    <div class="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Manage your personal information and preferences
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Avatar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h2>
            
            <!-- Avatar Preview -->
            <div class="flex flex-col items-center">
              <div class="relative">
                <div 
                  v-if="user?.avatar_url"
                  class="w-32 h-32 rounded-full overflow-hidden border-4 border-heritageTeal dark:border-mantapOrange"
                >
                  <img 
                    :src="getAvatarUrl(user.avatar_url)" 
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div 
                  v-else
                  class="w-32 h-32 rounded-full bg-heritageTeal dark:bg-mantapOrange flex items-center justify-center text-white text-3xl font-bold border-4 border-heritageTeal dark:border-mantapOrange"
                >
                  {{ userInitials }}
                </div>
                
                <!-- Upload overlay -->
                <label 
                  class="absolute bottom-0 right-0 w-10 h-10 bg-mantapOrange hover:bg-orange-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                  :class="{ 'opacity-50 cursor-not-allowed': uploadingAvatar }"
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarChange"
                    :disabled="uploadingAvatar"
                  />
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              
              <p v-if="uploadingAvatar" class="mt-3 text-sm text-heritageTeal dark:text-mantapOrange">
                Uploading...
              </p>
              
              <p class="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                Click the camera icon to upload a new photo<br>
                Max size: 5MB (JPEG, PNG, WebP)
              </p>
            </div>
          </div>

          <!-- Account Info Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Info
            </h2>
            <div class="space-y-3">
              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Role</label>
                <p class="text-gray-900 dark:text-white font-medium capitalize">
                  {{ user?.role?.replace('-', ' ') || 'User' }}
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Status</label>
                <p class="text-gray-900 dark:text-white font-medium capitalize">
                  {{ user?.status || 'Active' }}
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Member Since</label>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ formatDate(user?.created_at) }}
                </p>
              </div>
              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Last Login</label>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ user?.last_login ? formatDate(user.last_login) : 'Never' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Profile Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="saveProfile" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  v-model="form.city"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your city"
                />
              </div>

              <!-- State -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State/Province
                </label>
                <input
                  v-model="form.state"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your state"
                />
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  v-model="form.country"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your country"
                />
              </div>
            </div>

            <!-- Bio -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                v-model="form.bio"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tell us a little about yourself..."
              ></textarea>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ form.bio?.length || 0 }}/500 characters
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 sm:flex-none px-6 py-3 bg-heritageTeal hover:bg-teal-700 dark:bg-mantapOrange dark:hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              
              <button
                type="button"
                @click="resetForm"
                :disabled="saving"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </form>

          <!-- Change Password Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Change Password
            </h2>

            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                :disabled="changingPassword || passwordForm.newPassword !== passwordForm.confirmPassword"
                class="px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ changingPassword ? 'Changing...' : 'Change Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notification'
import NavBar from '../components/layout/NavBar.vue'
import Footer from '../components/layout/Footer.vue'
import api from '../services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

const saving = ref(false)
const uploadingAvatar = ref(false)
const changingPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  bio: '',
  city: '',
  state: '',
  country: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Initialize form with user data
onMounted(() => {
  if (user.value) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    bio: user.value?.bio || '',
    city: user.value?.city || '',
    state: user.value?.state || '',
    country: user.value?.country || ''
  }
}

const getAvatarUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // Remove '/api' from the base URL to get the server root
  const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
  const serverUrl = baseUrl.replace('/api', '')
  return `${serverUrl}${url}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    const response = await api.put('/users/me/profile', form.value)
    
    // Update local user data
    authStore.user = { ...authStore.user, ...response.data.user }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    
    notificationStore.success('Profile updated successfully')
  } catch (error) {
    console.error('Error updating profile:', error)
    notificationStore.error(
      error.response?.data?.message || 'Failed to update profile'
    )
  } finally {
    saving.value = false
  }
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    notificationStore.error('File size must be less than 5MB')
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    notificationStore.error('Only JPEG, PNG, and WebP images are allowed')
    return
  }

  uploadingAvatar.value = true

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Update local user data
    authStore.user = { ...authStore.user, ...response.data.user }
    localStorage.setItem('user', JSON.stringify(authStore.user))

    notificationStore.success('Profile picture updated successfully')
  } catch (error) {
    console.error('Error uploading avatar:', error)
    notificationStore.error(
      error.response?.data?.message || 'Failed to upload profile picture'
    )
  } finally {
    uploadingAvatar.value = false
    // Reset input
    event.target.value = ''
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    notificationStore.error('New passwords do not match')
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    notificationStore.error('Password must be at least 6 characters')
    return
  }

  changingPassword.value = true

  try {
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    notificationStore.success('Password changed successfully')
    
    // Reset password form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    notificationStore.error(
      error.response?.data?.message || 'Failed to change password'
    )
  } finally {
    changingPassword.value = false
  }
}
</script>
