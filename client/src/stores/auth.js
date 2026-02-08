import { defineStore } from 'pinia'
import api from '../services/api'

// Role hierarchy (higher number = more power)
const ROLE_HIERARCHY = {
  'super-admin': 10,
  'admin': 9,
  'creator': 8,
  'mentor': 5,
  'tutor': 5,
  'publisher': 4,
  'merchant': 4,
  'tuition-center': 4,
  'parent': 3,
  'student': 2,
  'user': 1
}

// Permission groups for quick checking
const PERMISSION_GROUPS = {
  ADMIN_ROLES: ['super-admin', 'admin', 'creator'],
  STAFF_ROLES: ['super-admin', 'admin', 'creator', 'mentor', 'tutor'],
  CONTENT_CREATORS: ['super-admin', 'admin', 'creator', 'publisher'],
  VERIFIED_ENTITIES: ['merchant', 'publisher', 'tuition-center'],
  MANAGED_USERS: ['parent', 'student', 'user']
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    permissions: JSON.parse(localStorage.getItem('permissions')) || [],
    isLoading: false,
    error: null,
    sessionExpiry: localStorage.getItem('sessionExpiry') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !state.isTokenExpired,
    
    isTokenExpired: (state) => {
      if (!state.sessionExpiry) return true
      return new Date().getTime() > parseInt(state.sessionExpiry)
    },

    userRole: (state) => state.user?.role || null,
    
    userRoleLevel: (state) => {
      return ROLE_HIERARCHY[state.user?.role] || 0
    },

    // Check if user has specific role
    isSuperAdmin: (state) => state.user?.role === 'super-admin',
    isAdmin: (state) => ['super-admin', 'admin'].includes(state.user?.role),
    isCreator: (state) => state.user?.role === 'creator',
    isMentor: (state) => state.user?.role === 'mentor',
    isTutor: (state) => state.user?.role === 'tutor',
    isParent: (state) => state.user?.role === 'parent',
    isStudent: (state) => state.user?.role === 'student',
    isPublisher: (state) => state.user?.role === 'publisher',
    isMerchant: (state) => state.user?.role === 'merchant',
    isTuitionCenter: (state) => state.user?.role === 'tuition-center',

    // Check role groups
    isStaff: (state) => PERMISSION_GROUPS.STAFF_ROLES.includes(state.user?.role),
    isAdminLevel: (state) => PERMISSION_GROUPS.ADMIN_ROLES.includes(state.user?.role),
    canCreateContent: (state) => PERMISSION_GROUPS.CONTENT_CREATORS.includes(state.user?.role),

    // Check specific permission
    hasPermission: (state) => (permission) => {
      if (state.user?.role === 'super-admin') return true
      return state.permissions.includes(permission)
    },

    // Check any permission from array
    hasAnyPermission: (state) => (permissions) => {
      if (state.user?.role === 'super-admin') return true
      return permissions.some(p => state.permissions.includes(p))
    },

    // Check all permissions from array
    hasAllPermissions: (state) => (permissions) => {
      if (state.user?.role === 'super-admin') return true
      return permissions.every(p => state.permissions.includes(p))
    },

    // Check if user can manage other users
    canManageUsers: (state) => {
      return ['super-admin', 'admin', 'creator'].includes(state.user?.role)
    },

    // Check if user can manage specific role
    canManageRole: (state) => (targetRole) => {
      const currentLevel = ROLE_HIERARCHY[state.user?.role] || 0
      const targetLevel = ROLE_HIERARCHY[targetRole] || 0
      return currentLevel > targetLevel
    },

    // Get user display name
    displayName: (state) => {
      return state.user?.name || state.user?.email || 'User'
    },

    // Get user initials for avatar
    userInitials: (state) => {
      const name = state.user?.name || state.user?.email || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },

    // Check if user has completed profile
    hasCompletedProfile: (state) => {
      return state.user?.profile_completed || false
    }
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/login', credentials)
        const { token, user, permissions } = response.data

        // Set session expiry (1 hour from now)
        const expiryTime = new Date().getTime() + (60 * 60 * 1000)
        
        this.token = token
        this.user = user
        this.permissions = permissions || []
        this.sessionExpiry = expiryTime.toString()

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('permissions', JSON.stringify(permissions || []))
        localStorage.setItem('sessionExpiry', expiryTime.toString())

        // Update axios default header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/register', userData)
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // Call logout endpoint if available
        if (this.token) {
          await api.post('/auth/logout').catch(() => {})
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear local state
        this.token = null
        this.user = null
        this.permissions = []
        this.sessionExpiry = null
        this.error = null

        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')
        localStorage.removeItem('sessionExpiry')

        // Remove axios header
        delete api.defaults.headers.common['Authorization']
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.user
        this.permissions = response.data.permissions || []
        
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('permissions', JSON.stringify(this.permissions))
        
        return { success: true, user: this.user }
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        return { success: false, error: error.message }
      }
    },

    async updateProfile(profileData) {
      this.isLoading = true
      
      try {
        const response = await api.put('/auth/profile', profileData)
        this.user = { ...this.user, ...response.data.user }
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true, user: this.user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Update failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async changePassword(passwordData) {
      try {
        await api.post('/auth/change-password', passwordData)
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Password change failed' 
        }
      }
    },

    async refreshToken() {
      try {
        const response = await api.post('/auth/refresh')
        const { token } = response.data
        
        const expiryTime = new Date().getTime() + (60 * 60 * 1000)
        
        this.token = token
        this.sessionExpiry = expiryTime.toString()
        
        localStorage.setItem('token', token)
        localStorage.setItem('sessionExpiry', expiryTime.toString())
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true }
      } catch (error) {
        // If refresh fails, logout user
        await this.logout()
        return { success: false, error: 'Session expired' }
      }
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      const permissions = localStorage.getItem('permissions')
      const sessionExpiry = localStorage.getItem('sessionExpiry')

      if (token && user && sessionExpiry) {
        // Check if session is expired
        if (new Date().getTime() > parseInt(sessionExpiry)) {
          this.logout()
          return false
        }

        this.token = token
        this.user = JSON.parse(user)
        this.permissions = JSON.parse(permissions || '[]')
        this.sessionExpiry = sessionExpiry

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return true
      }
      
      return false
    },

    // Check and refresh token if needed (call this periodically)
    async checkSession() {
      if (!this.token) return false
      
      const timeUntilExpiry = parseInt(this.sessionExpiry) - new Date().getTime()
      
      // Refresh if token expires in less than 10 minutes
      if (timeUntilExpiry < 10 * 60 * 1000) {
        return await this.refreshToken()
      }
      
      return true
    },

    clearError() {
      this.error = null
    }
  }
})
