<template>
  <div class="min-h-screen bg-softGreen/30 dark:bg-gray-900">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-heritageTeal mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">Mencari sekolah...</p>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-heritageTeal to-teal-700 dark:from-heritageTeal/90 dark:to-teal-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Malaysian School Directory
          </h1>
          <p class="text-lg md:text-xl text-teal-100 mb-2 max-w-3xl mx-auto">
            Discover {{ totalSchoolsAll.toLocaleString() }} primary and secondary schools across Malaysia.
            Find information, compare schools, and connect with educators.
          </p>

          <!-- Filtered Results Indicator -->
          <p v-if="activeFiltersCount > 0" class="text-sm md:text-base text-teal-200 mb-8 max-w-3xl mx-auto">
            Showing {{ filteredSchoolsCount.toLocaleString() }} schools {{ filterContextString }}
          </p>
          <p v-else class="text-sm md:text-base text-teal-200/70 mb-8 max-w-3xl mx-auto">
            Showing all schools
          </p>
          
          <!-- Search Bar - Professional Design -->
          <div class="max-w-3xl mx-auto mb-8">
            <div class="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-600 focus-within:border-heritageTeal focus-within:ring-4 focus-within:ring-heritageTeal/20 transition-all overflow-hidden">
              <!-- Search Icon -->
              <div class="pl-6 pr-3 text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              <!-- Input Field -->
              <input 
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text" 
                placeholder="Search by school name, code, or city..." 
                class="flex-1 py-5 px-2 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              
              <!-- Clear Button (shown when text exists) -->
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''; handleSearch()"
                class="p-2 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              
              <!-- Search Button - Seamless Integration -->
              <button 
                @click="handleSearch" 
                class="bg-mantapOrange hover:bg-orange-600 text-white font-semibold px-8 py-5 transition-colors border-l-2 border-orange-600 hover:border-orange-700"
              >
                Search
              </button>
            </div>
          </div>

          <!-- Filters Section - Same as Landing Page -->
          <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-transparent dark:border-gray-700 transition-colors duration-300">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
              <!-- Negeri Filter -->
              <div class="w-full">
                <select 
                  v-model="selectedNegeri"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Semua Negeri</option>
                  <option v-for="negeri in negeriOptions" :key="negeri" :value="negeri">
                    {{ negeri }}
                  </option>
                </select>
              </div>
              
              <!-- PPD Filter -->
              <div class="w-full">
                <select 
                  v-model="selectedPPD"
                  :disabled="!selectedNegeri"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">Semua PPD</option>
                  <option v-for="ppd in availablePPDs" :key="ppd" :value="ppd">
                    {{ ppd }}
                  </option>
                </select>
              </div>
              
              <!-- Bandar Filter -->
              <div class="w-full">
                <select 
                  v-model="selectedCity"
                  :disabled="!selectedNegeri"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">Semua Bandar</option>
                  <option v-for="city in availableCitiesByNegeri" :key="city" :value="city">
                    {{ toSentenceCase(city) }}
                  </option>
                </select>
              </div>
              
              <!-- Peringkat Filter -->
              <div class="w-full">
                <select 
                  v-model="selectedPeringkat"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Semua Peringkat</option>
                  <option value="Rendah">Rendah (Primary)</option>
                  <option value="Menengah">Menengah (Secondary)</option>
                </select>
              </div>
              
              <!-- Jenis Filter -->
              <div class="w-full">
                <select 
                  v-model="selectedJenis"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Semua Jenis</option>
                  <option v-for="jenis in jenisOptions" :key="jenis.value" :value="jenis.value">
                    {{ jenis.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Results Header -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="text-gray-700 dark:text-gray-300">
          Showing <span class="font-semibold text-heritageTeal">{{ schools.length }}</span> of 
          <span class="font-semibold">{{ totalSchools.toLocaleString() }}</span> schools
        </div>
        <div class="flex items-center gap-3">
          <!-- Active Filters Badge -->
          <span 
            v-if="activeFiltersCount > 0" 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-heritageTeal/10 text-heritageTeal dark:bg-heritageTeal/20"
          >
            {{ activeFiltersCount }} filter{{ activeFiltersCount > 1 ? 's' : '' }} active
          </span>
          
          <!-- Clear Filters Button -->
          <button
            v-if="activeFiltersCount > 0"
            @click="clearFilters"
            class="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Clear All
          </button>
          
          <div class="h-6 w-px bg-gray-300 dark:bg-gray-600" v-if="activeFiltersCount > 0"></div>
          
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

      <!-- Schools Grid -->
      <div v-if="schools.length > 0" class="space-y-4">
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
                :src="school.logo_url || '/images/school-placeholder.svg'"
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

        <!-- Pagination Controls -->
        <div class="mt-8 space-y-4">
          <!-- Items Per Page & Page Info -->
          <div class="flex flex-wrap items-center justify-between gap-4 px-4">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select
                v-model="itemsPerPage"
                @change="handleItemsPerPageChange"
                class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-heritageTeal focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option :value="50">50</option>
                <option :value="100">100</option>
                <option :value="250">250</option>
                <option :value="500">500</option>
              </select>
              <span class="text-sm text-gray-600 dark:text-gray-400">per page</span>
            </div>
            
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, filteredSchoolsCount) }} 
              of {{ filteredSchoolsCount.toLocaleString() }} results
            </div>
          </div>
          
          <!-- Page Numbers Navigation -->
          <div class="flex items-center justify-center gap-1 flex-wrap">
            <!-- First Page -->
            <button
              @click="changePage(1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
            >
              First
            </button>
            
            <!-- Previous Button -->
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <!-- Page Numbers -->
            <template v-for="page in displayedPages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                :class="[
                  'px-4 py-2 text-sm font-medium border rounded-lg transition-colors min-w-[40px]',
                  currentPage === page
                    ? 'bg-heritageTeal text-white border-heritageTeal'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="px-3 py-2 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            </template>
            
            <!-- Next Button -->
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            
            <!-- Last Page -->
            <button
              @click="changePage(totalPages)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
            >
              Last
            </button>
          </div>
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSchoolStore } from '@/stores/schools'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const schoolStore = useSchoolStore()

// Use storeToRefs for reactive store state
const { filterOptions } = storeToRefs(schoolStore)

// State - Same as landing page
const searchQuery = ref('')
const selectedNegeri = ref('')
const selectedPPD = ref('')
const selectedCity = ref('')
const selectedJenis = ref('')
const selectedPeringkat = ref('')
const sortBy = ref('nama_sekolah')
const loading = ref(false)
const itemsPerPage = ref(50)

// Store total schools count (always shows in hero, never changes)
const totalSchoolsAll = ref(0)

// Data mappings - Same as landing page
const ppdCityData = ref({})
const negeriToPPDMap = ref({})
const jenisOptions = ref([])

// Computed negeri options from store - REACTIVE
const negeriOptions = computed(() => filterOptions.value.negeris || [])

// Computed - Same as landing page
const schools = computed(() => schoolStore.schools)
const totalSchools = computed(() => schoolStore.totalSchools)
const currentPage = computed(() => schoolStore.currentPage)
const totalPages = computed(() => schoolStore.totalPages)

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedNegeri.value) count++
  if (selectedPPD.value) count++
  if (selectedCity.value) count++
  if (selectedJenis.value) count++
  if (selectedPeringkat.value) count++
  return count
})

// Get filtered schools count from store
const filteredSchoolsCount = computed(() => schoolStore.totalSchools)

// Build filter context string for display (e.g., "in PPD Batu Pahat, Johor")
const filterContextString = computed(() => {
  const parts = []
  
  if (selectedPPD.value) {
    parts.push(selectedPPD.value)
  }
  if (selectedCity.value) {
    parts.push(toSentenceCase(selectedCity.value))
  }
  if (selectedNegeri.value) {
    parts.push(selectedNegeri.value)
  }
  if (selectedPeringkat.value) {
    const level = selectedPeringkat.value === 'Rendah' ? 'Primary' : 'Secondary'
    parts.push(`${selectedPeringkat.value} (${level})`)
  }
  if (selectedJenis.value) {
    parts.push(`Type: ${selectedJenis.value}`)
  }
  if (searchQuery.value) {
    parts.push(`Search: "${searchQuery.value}"`)
  }
  
  if (parts.length === 0) {
    return ''
  }
  
  return 'in ' + parts.join(', ')
})

// Compute displayed page numbers with ellipsis
const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first and last page
    if (current <= 3) {
      // Near the beginning
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 2) {
      // Near the end
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      // In the middle
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

// Available PPDs based on selected Negeri - Same as landing page
const availablePPDs = computed(() => {
  if (!selectedNegeri.value || selectedCity.value) return []
  return negeriToPPDMap.value[selectedNegeri.value] || []
})

// Available cities based on selected Negeri - Same as landing page
const availableCitiesByNegeri = computed(() => {
  if (!selectedNegeri.value || selectedPPD.value) return []
  
  const allCities = new Set()
  const ppdsInNegeri = negeriToPPDMap.value[selectedNegeri.value] || []
  
  ppdsInNegeri.forEach(ppd => {
    const cities = ppdCityData.value[ppd] || []
    cities.forEach(city => allCities.add(city))
  })
  
  return Array.from(allCities).sort()
})

// Watchers - Same as landing page
watch(selectedPPD, () => {
  selectedCity.value = ''
})

watch(selectedNegeri, () => {
  selectedPPD.value = ''
  selectedCity.value = ''
  applyFilters()
})

watch([selectedPPD, selectedCity, selectedJenis, selectedPeringkat], () => {
  applyFilters()
})

// Methods
const fetchPPDData = async () => {
  try {
    loading.value = true
    
    // Fetch schools to extract PPD and city data (fetch all for mapping)
    await schoolStore.fetchSchools({ limit: 10000, page: 1 })
    const schools = schoolStore.schools
    
    // Group cities by PPD and collect jenis
    const data = {}
    const negeriPPDMap = {}
    const jenisSet = new Set()
    
    schools.forEach(school => {
      // Collect jenis
      if (school.jenis) {
        jenisSet.add(school.jenis)
      }
      
      // PPD-city mapping
      if (school.ppd && school.bandar) {
        if (!data[school.ppd]) {
          data[school.ppd] = new Set()
        }
        data[school.ppd].add(school.bandar)
      }
      
      // Negeri-PPD mapping
      if (school.negeri && school.ppd) {
        if (!negeriPPDMap[school.negeri]) {
          negeriPPDMap[school.negeri] = new Set()
        }
        negeriPPDMap[school.negeri].add(school.ppd)
      }
    })
    
    // Convert sets to arrays
    ppdCityData.value = {}
    Object.keys(data).forEach(ppd => {
      ppdCityData.value[ppd] = Array.from(data[ppd]).sort()
    })
    
    negeriToPPDMap.value = {}
    Object.keys(negeriPPDMap).forEach(negeri => {
      negeriToPPDMap.value[negeri] = Array.from(negeriPPDMap[negeri]).sort()
    })
    
    // Set jenis options
    jenisOptions.value = Array.from(jenisSet).sort().map(jenis => ({ 
      value: jenis, 
      label: jenis 
    }))
    
    // Fetch negeri options from server (will update filterOptions via storeToRefs)
    await schoolStore.fetchFilterOptions()

  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  applyFilters()
}

const applyFilters = () => {
  loading.value = true
  
  const query = {
    search: searchQuery.value,
    negeri: selectedNegeri.value,
    ppd: selectedPPD.value,
    bandar: selectedCity.value,
    jenis: selectedJenis.value,
    peringkat: selectedPeringkat.value,
    page: 1
  }
  
  schoolStore.setFilters(query)
  schoolStore.fetchSchools({ 
    page: 1,
    limit: itemsPerPage.value,
    sortBy: sortBy.value 
  }).finally(() => {
    loading.value = false
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedNegeri.value = ''
  selectedPPD.value = ''
  selectedCity.value = ''
  selectedJenis.value = ''
  selectedPeringkat.value = ''
  sortBy.value = 'nama_sekolah'
  itemsPerPage.value = 50
  
  schoolStore.clearFilters()
  schoolStore.fetchSchools({ page: 1, limit: 50 })
}

const changePage = (page) => {
  schoolStore.fetchSchools({ page, limit: itemsPerPage.value, sortBy: sortBy.value })
}

const handleItemsPerPageChange = () => {
  // Reset to page 1 when changing items per page
  schoolStore.fetchSchools({ page: 1, limit: itemsPerPage.value, sortBy: sortBy.value })
}

const viewSchool = (id) => {
  router.push(`/schools/${id}`)
}

const toSentenceCase = (str) => {
  if (!str) return str
  return str.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase())
}

// Initialize
onMounted(async () => {
  // Check for query parameters from landing page
  const { search, ppd, bandar, jenis, peringkat, negeri } = route.query

  if (search) searchQuery.value = search
  if (ppd) selectedPPD.value = ppd
  if (bandar) selectedCity.value = bandar
  if (jenis) selectedJenis.value = jenis
  if (peringkat) selectedPeringkat.value = peringkat
  if (negeri) selectedNegeri.value = negeri

  // Fetch PPD data first (includes negeri options)
  await fetchPPDData()

  // Store the total schools count for hero display (this is the unfiltered total)
  totalSchoolsAll.value = schoolStore.totalSchools

  // Then apply filters if any
  if (search || ppd || bandar || jenis || peringkat || negeri) {
    applyFilters()
  } else {
    // Initial fetch with default items per page
    await schoolStore.fetchSchools({ page: 1, limit: itemsPerPage.value })
  }
})
</script>
