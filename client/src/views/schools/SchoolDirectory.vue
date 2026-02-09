<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-heritageTeal to-teal-700 dark:from-heritageTeal/90 dark:to-teal-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Malaysian School Directory
          </h1>
          <p class="text-lg md:text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Discover {{ totalSchools.toLocaleString() }} primary and secondary schools across Malaysia. 
            Find information, compare schools, and connect with educators.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto relative">
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              placeholder="Search by school name or code..."
              class="w-full px-6 py-4 pl-14 rounded-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-0 shadow-lg focus:ring-2 focus:ring-mantapOrange text-lg"
            />
            <svg class="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-heritageTeal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filters
            </h2>

            <!-- State Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <select
                v-model="filters.negeri"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All States</option>
                <option v-for="state in filterOptions.states" :key="state" :value="state">
                  {{ state }}
                </option>
              </select>
            </div>

            <!-- Education Level -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Education Level
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="filters.peringkat"
                    type="radio"
                    value=""
                    @change="applyFilters"
                    class="text-heritageTeal focus:ring-heritageTeal"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">All Levels</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.peringkat"
                    type="radio"
                    value="Rendah"
                    @change="applyFilters"
                    class="text-heritageTeal focus:ring-heritageTeal"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Primary</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.peringkat"
                    type="radio"
                    value="Menengah"
                    @change="applyFilters"
                    class="text-heritageTeal focus:ring-heritageTeal"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Secondary</span>
                </label>
              </div>
            </div>

            <!-- School Type -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School Type
              </label>
              <select
                v-model="filters.jenis"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                <option v-for="type in filterOptions.types" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <!-- Claim Status -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="filters.claimed"
                    type="radio"
                    value=""
                    @change="applyFilters"
                    class="text-heritageTeal focus:ring-heritageTeal"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">All Schools</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.claimed"
                    type="radio"
                    value="true"
                    @change="applyFilters"
                    class="text-heritageTeal focus:ring-heritageTeal"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Claimed</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.claimed"
                    type="radio"
                    value="false"
                    @change="applyFilters"
                    class="text-heritageTeal focus:ring-heritageTeal"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Unclaimed</span>
                </label>
              </div>
            </div>

            <button
              @click="clearFilters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="flex-1">
          <!-- Stats Bar -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div class="text-gray-700 dark:text-gray-300">
              Showing <span class="font-semibold">{{ schools.length }}</span> of 
              <span class="font-semibold">{{ totalSchools.toLocaleString() }}</span> schools
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="nama_sekolah">Name (A-Z)</option>
                <option value="nama_sekolah DESC">Name (Z-A)</option>
                <option value="negeri">State</option>
                <option value="jumlah_murid DESC">Student Count</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-heritageTeal"></div>
          </div>

          <!-- Schools Grid -->
          <div v-else-if="schools.length > 0" class="space-y-4">
            <div
              v-for="school in schools"
              :key="school.id"
              @click="viewSchool(school.id)"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div class="flex flex-col md:flex-row gap-4">
                <!-- School Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="school.logo_url || '/images/school-placeholder.png'"
                    :alt="school.nama_sekolah"
                    class="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover bg-gray-100"
                  />
                </div>

                <!-- School Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-heritageTeal transition-colors">
                      {{ school.nama_sekolah }}
                    </h3>
                    <span
                      v-if="school.status_claim === 'CLAIMED'"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Verified
                    </span>
                  </div>

                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span class="font-medium">{{ school.kod_sekolah }}</span> • 
                    <span>{{ school.bandar }}, {{ school.negeri }}</span>
                  </div>

                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {{ school.jenis }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {{ school.peringkat }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      {{ school.jumlah_murid?.toLocaleString() || 0 }} students
                    </div>
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                      </svg>
                      {{ school.jumlah_guru || 0 }} teachers
                    </div>
                    <div v-if="school.no_telefon" class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      {{ school.no_telefon }}
                    </div>
                  </div>
                </div>

                <!-- Arrow -->
                <div class="hidden md:flex items-center">
                  <svg class="w-6 h-6 text-gray-400 group-hover:text-heritageTeal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-center gap-2 mt-8">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
              >
                Previous
              </button>
              <span class="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No schools found
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
            <button
              @click="clearFilters"
              class="mt-4 px-4 py-2 bg-heritageTeal text-white rounded-lg hover:bg-heritageTeal/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '@/stores/schools'

const router = useRouter()
const schoolStore = useSchoolStore()

// State
const searchQuery = ref('')
const sortBy = ref('nama_sekolah')

// Computed
const schools = computed(() => schoolStore.schools)
const totalSchools = computed(() => schoolStore.totalSchools)
const currentPage = computed(() => schoolStore.currentPage)
const totalPages = computed(() => schoolStore.totalPages)
const loading = computed(() => schoolStore.loading)
const filters = computed(() => schoolStore.filters)
const filterOptions = computed(() => schoolStore.filterOptions)

// Methods
onMounted(async () => {
  await Promise.all([
    schoolStore.fetchSchools(),
    schoolStore.fetchFilterOptions()
  ])
})

let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    schoolStore.setFilters({ search: searchQuery.value })
    schoolStore.fetchSchools({ page: 1 })
  }, 300)
}

const applyFilters = () => {
  schoolStore.fetchSchools({ page: 1 })
}

const clearFilters = () => {
  searchQuery.value = ''
  schoolStore.clearFilters()
  schoolStore.fetchSchools({ page: 1 })
}

const changePage = (page) => {
  schoolStore.fetchSchools({ page })
}

const viewSchool = (id) => {
  router.push(`/schools/${id}`)
}
</script>
