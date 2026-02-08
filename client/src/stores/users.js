import { defineStore } from 'pinia'
import api from '../services/api'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    filters: {
      role: null,
      status: null,
      search: '',
      dateFrom: null,
      dateTo: null
    },
    isLoading: false,
    error: null,
    lastFetch: null
  }),

  getters: {
    // Get users by role
    getUsersByRole: (state) => (role) => {
      return state.users.filter(user => user.role === role)
    },

    // Get active users only
    activeUsers: (state) => {
      return state.users.filter(user => user.status === 'active')
    },

    // Get pending users
    pendingUsers: (state) => {
      return state.users.filter(user => user.status === 'pending')
    },

    // Get suspended users
    suspendedUsers: (state) => {
      return state.users.filter(user => user.status === 'suspended')
    },

    // Get role counts
    roleCounts: (state) => {
      const counts = {}
      state.users.forEach(user => {
        counts[user.role] = (counts[user.role] || 0) + 1
      })
      return counts
    },

    // Get status counts
    statusCounts: (state) => {
      const counts = {}
      state.users.forEach(user => {
        counts[user.status] = (counts[user.status] || 0) + 1
      })
      return counts
    },

    // Check if data needs refresh (older than 5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      return new Date().getTime() - state.lastFetch > 5 * 60 * 1000
    }
  },

  actions: {
    // Fetch users with pagination and filters
    async fetchUsers(params = {}) {
      this.isLoading = true
      this.error = null

      try {
        const queryParams = {
          page: params.page || this.currentPage,
          limit: params.limit || 10,
          ...this.filters,
          ...params
        }

        const response = await api.get('/users', { params: queryParams })
        
        this.users = response.data.users
        this.totalUsers = response.data.total
        this.currentPage = response.data.currentPage
        this.totalPages = response.data.totalPages
        this.lastFetch = new Date().getTime()

        return { 
          success: true, 
          users: this.users, 
          total: this.totalUsers 
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Fetch single user by ID
    async fetchUserById(userId) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.get(`/users/${userId}`)
        this.currentUser = response.data.user
        return { success: true, user: this.currentUser }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch user'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Create new user
    async createUser(userData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.post('/users', userData)
        
        // Add to local list if on first page
        if (this.currentPage === 1) {
          this.users.unshift(response.data.user)
          this.totalUsers++
        }

        return { success: true, user: response.data.user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create user'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Update user
    async updateUser(userId, userData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.put(`/users/${userId}`, userData)
        
        // Update in local list
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...response.data.user }
        }

        // Update current user if it's the same
        if (this.currentUser?.id === userId) {
          this.currentUser = { ...this.currentUser, ...response.data.user }
        }

        return { success: true, user: response.data.user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Delete user
    async deleteUser(userId) {
      this.isLoading = true
      this.error = null

      try {
        await api.delete(`/users/${userId}`)
        
        // Remove from local list
        this.users = this.users.filter(u => u.id !== userId)
        this.totalUsers--

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Bulk delete users
    async bulkDeleteUsers(userIds) {
      this.isLoading = true
      this.error = null

      try {
        await api.post('/users/bulk-delete', { userIds })
        
        // Remove from local list
        this.users = this.users.filter(u => !userIds.includes(u.id))
        this.totalUsers -= userIds.length

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete users'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Update user status
    async updateUserStatus(userId, status) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.patch(`/users/${userId}/status`, { status })
        
        // Update in local list
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index].status = status
        }

        if (this.currentUser?.id === userId) {
          this.currentUser.status = status
        }

        return { success: true, user: response.data.user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update status'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Update user role
    async updateUserRole(userId, role) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.patch(`/users/${userId}/role`, { role })
        
        // Update in local list
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index].role = role
        }

        if (this.currentUser?.id === userId) {
          this.currentUser.role = role
        }

        return { success: true, user: response.data.user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update role'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Bulk update status
    async bulkUpdateStatus(userIds, status) {
      this.isLoading = true
      this.error = null

      try {
        await api.post('/users/bulk-status', { userIds, status })
        
        // Update in local list
        this.users = this.users.map(u => {
          if (userIds.includes(u.id)) {
            return { ...u, status }
          }
          return u
        })

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update statuses'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Get user statistics
    async fetchUserStats() {
      try {
        const response = await api.get('/users/stats')
        return { success: true, stats: response.data }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Failed to fetch stats' 
        }
      }
    },

    // Get user activity logs
    async fetchUserActivity(userId, params = {}) {
      try {
        const response = await api.get(`/users/${userId}/activity`, { params })
        return { success: true, activities: response.data.activities }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Failed to fetch activity' 
        }
      }
    },

    // Export users
    async exportUsers(format = 'csv', filters = {}) {
      try {
        const response = await api.get('/users/export', {
          params: { format, ...filters },
          responseType: 'blob'
        })
        
        // Create download link
        const blob = new Blob([response.data], { 
          type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' 
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `users_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Export failed' 
        }
      }
    },

    // Set filters
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.currentPage = 1 // Reset to first page when filters change
    },

    // Clear filters
    clearFilters() {
      this.filters = {
        role: null,
        status: null,
        search: '',
        dateFrom: null,
        dateTo: null
      }
      this.currentPage = 1
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Reset store
    reset() {
      this.users = []
      this.currentUser = null
      this.totalUsers = 0
      this.currentPage = 1
      this.totalPages = 1
      this.clearFilters()
      this.lastFetch = null
    }
  }
})
