import { defineStore } from 'pinia'
import api from '@/services/api'

export const useSchoolStore = defineStore('schools', {
    state: () => ({
        schools: [],
        totalSchools: 0,
        currentPage: 1,
        totalPages: 1,
        currentSchool: null,
        filters: {
            search: '',
            negeri: '',
            peringkat: '',
            jenis: '',
            ppd: '',
            bandar: ''
        },
        filterOptions: {
            states: [],
            types: [],
            ppds: [],
            peringkat: ['Rendah', 'Menengah'],
            cities: {}
        },
        loading: false,
        error: null,
        claims: [],
        importHistory: []
    }),

    actions: {
        // Fetch schools with filters
        async fetchSchools(params = {}) {
            this.loading = true
            this.error = null
            
            try {
                const queryParams = new URLSearchParams({
                    page: params.page || this.currentPage,
                    limit: params.limit || 20,
                    ...this.filters,
                    ...params
                })

                const response = await api.get(`/schools?${queryParams}`)
                this.schools = response.data.schools
                this.totalSchools = response.data.total
                this.currentPage = response.data.currentPage
                this.totalPages = response.data.totalPages
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch schools'
                console.error('Error fetching schools:', error)
            } finally {
                this.loading = false
            }
        },

        // Get single school
        async fetchSchoolById(id) {
            this.loading = true
            this.error = null
            
            try {
                const response = await api.get(`/schools/${id}`)
                this.currentSchool = response.data.school
                return response.data.school
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch school'
                console.error('Error fetching school:', error)
            } finally {
                this.loading = false
            }
        },

        // Get filter options
        async fetchFilterOptions() {
            try {
                const response = await api.get('/schools/filters/options')
                this.filterOptions = {
                    states: response.data.states,
                    types: response.data.types,
                    ppds: response.data.ppds,
                    peringkat: response.data.peringkat,
                    cities: response.data.cities || {}
                }
            } catch (error) {
                console.error('Error fetching filter options:', error)
            }
        },

        // Set filters
        setFilters(filters) {
            this.filters = { ...this.filters, ...filters }
        },

        // Clear filters
        clearFilters() {
            this.filters = {
                search: '',
                negeri: '',
                peringkat: '',
                jenis: '',
                ppd: '',
                bandar: ''
            }
        },

        // ============================================
        // ADMIN ACTIONS
        // ============================================

        // Create school
        async createSchool(schoolData) {
            try {
                const response = await api.post('/schools', schoolData)
                return response.data
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to create school')
            }
        },

        // Update school
        async updateSchool(id, schoolData) {
            try {
                const response = await api.put(`/schools/${id}`, schoolData)
                return response.data
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to update school')
            }
        },

        // Delete school
        async deleteSchool(id) {
            try {
                await api.delete(`/schools/${id}`)
                // Remove from local state
                this.schools = this.schools.filter(s => s.id !== parseInt(id))
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to delete school')
            }
        },

        // Bulk delete
        async bulkDeleteSchools(ids) {
            try {
                await api.post('/schools/bulk-delete', { ids })
                this.schools = this.schools.filter(s => !ids.includes(s.id))
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to delete schools')
            }
        },

        // ============================================
        // CLAIM ACTIONS
        // ============================================

        // Submit claim
        async submitClaim(schoolId, claimData) {
            try {
                const response = await api.post(`/schools/${schoolId}/claim`, claimData)
                return response.data
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to submit claim')
            }
        },

        // Fetch user claims
        async fetchMyClaims() {
            try {
                const response = await api.get('/schools/my/claims')
                this.claims = response.data.claims
            } catch (error) {
                console.error('Error fetching claims:', error)
            }
        },

        // Admin: Get all claims
        async fetchAdminClaims(status = 'PENDING') {
            try {
                const response = await api.get(`/schools/admin/claims?status=${status}`)
                return response.data
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to fetch claims')
            }
        },

        // Admin: Approve claim
        async approveClaim(claimId) {
            try {
                await api.post(`/schools/admin/claims/${claimId}/approve`)
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to approve claim')
            }
        },

        // Admin: Reject claim
        async rejectClaim(claimId, reason) {
            try {
                await api.post(`/schools/admin/claims/${claimId}/reject`, { reason })
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to reject claim')
            }
        },

        // ============================================
        // IMPORT ACTIONS
        // ============================================

        // Fetch import history
        async fetchImportHistory() {
            try {
                const response = await api.get('/schools/admin/import-history')
                this.importHistory = response.data.logs
            } catch (error) {
                console.error('Error fetching import history:', error)
            }
        }
    }
})
