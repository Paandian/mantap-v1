<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '../../stores/users'
import { useNotificationStore } from '../../stores/notification'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  roles: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const isEditing = computed(() => !!props.user)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'pending',
  password: '',
  confirmPassword: ''
})

// Watch for changes in user prop and update formData
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = {
      name: newUser.name || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      role: newUser.role || 'user',
      status: newUser.status || 'pending',
      password: '',
      confirmPassword: ''
    }
  } else {
    // Reset form for new user
    formData.value = {
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'pending',
      password: '',
      confirmPassword: ''
    }
  }
}, { immediate: true })

const errors = ref({})
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
  }
  
  if (!isEditing.value) {
    if (!formData.value.password) {
      errors.value.password = 'Password is required'
    } else if (formData.value.password.length < 8) {
      errors.value.password = 'Password must be at least 8 characters'
    }
    
    if (formData.value.password !== formData.value.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      role: formData.value.role,
      status: formData.value.status
    }
    
    if (!isEditing.value) {
      payload.password = formData.value.password
    }
    
    let result
    if (isEditing.value) {
      result = await userStore.updateUser(props.user.id, payload)
    } else {
      result = await userStore.createUser(payload)
    }
    
    if (result.success) {
      notificationStore.success(isEditing.value ? 'User updated successfully' : 'User created successfully')
      emit('save')
    } else {
      errors.value.submit = result.error
      notificationStore.error(result.error || 'An error occurred. Please try again.')
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.'
    errors.value.submit = errorMessage
    notificationStore.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Edit User' : 'Create New User' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Error Message -->
        <div v-if="errors.submit" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ errors.submit }}
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            :class="errors.name ? 'border-red-300' : 'border-gray-300'"
            placeholder="Enter full name"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            :class="errors.email ? 'border-red-300' : 'border-gray-300'"
            placeholder="Enter email address"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            v-model="formData.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter phone number"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Role <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.role"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option v-for="role in roles" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>

        <!-- Status -->
        <div v-if="isEditing">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Status <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <!-- Password (only for new users) -->
        <template v-if="!isEditing">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="errors.password ? 'border-red-300' : 'border-gray-300'"
              placeholder="Enter password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="errors.confirmPassword ? 'border-red-300' : 'border-gray-300'"
              placeholder="Confirm password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>
        </template>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>