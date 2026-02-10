<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from '@/stores/schools'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const schoolStore = useSchoolStore()

const featuredSchools = ref([])
const searchQuery = ref('')
const selectedNegeri = ref('')
const selectedPPD = ref('')
const selectedJenis = ref('')
const selectedCity = ref('')
const loading = ref(false)
const showAllCities = ref({})
const negeriOptions = ref([])
const ppdOptions = ref([])
const schoolCounts = ref({
  byState: {},
  byCity: {}
})
const cityToPPDMap = ref({})
const negeriToPPDMap = ref({})
const citiesByNegeriData = ref({})

// Jenis options from database (school types like SK, SJKC, SJKT, SM, etc.)
const jenisOptions = ref([])

// FILTER-SPECIFIC COMPUTED PROPERTIES (Separate from category listing)
// These only affect the filter dropdowns, not the category display

// Filter: Available PPDs for selected Negeri
// Returns empty if city is selected (mutual exclusion)
const filterPPDs = computed(() => {
  if (!selectedNegeri.value || selectedCity.value) return []
  const ppds = negeriToPPDMap.value[selectedNegeri.value]
  return ppds ? [...ppds] : [] // Convert Proxy to regular array
})

// Filter: Available cities for selected Negeri  
// Returns empty if PPD is selected (mutual exclusion)
const filterCities = computed(() => {
  if (!selectedNegeri.value || selectedPPD.value) return []
  const cities = citiesByNegeriData.value[selectedNegeri.value]
  return cities ? [...cities] : [] // Convert Proxy to regular array
})





// State keywords for matching PPDs to states (normalized names without W.P. prefix)
const stateKeywords = {
  'Johor': ['Johor', 'JB', 'Johor Bahru', 'Batu Pahat', 'Kluang', 'Muar', 'Segamat'],
  'Kedah': ['Kedah', 'Alor Setar', 'Sungai Petani', 'Kulim', 'Langkawi'],
  'Kelantan': ['Kelantan', 'Kota Bharu', 'Pasir Mas', 'Tanah Merah'],
  'Melaka': ['Melaka', 'Malacca'],
  'Negeri Sembilan': ['Negeri Sembilan', 'Seremban', 'Port Dickson'],
  'Pahang': ['Pahang', 'Kuantan', 'Temerloh', 'Bentong'],
  'Perak': ['Perak', 'Ipoh', 'Taiping', 'Teluk Intan'],
  'Perlis': ['Perlis', 'Kangar'],
  'Pulau Pinang': ['Pulau Pinang', 'Penang', 'Georgetown', 'Butterworth', 'Bayan Lepas'],
  'Sabah': ['Sabah', 'Kota Kinabalu', 'Sandakan', 'Tawau'],
  'Sarawak': ['Sarawak', 'Kuching', 'Miri', 'Sibu', 'Bintulu'],
  'Selangor': ['Selangor', 'Shah Alam', 'Petaling', 'Klang', 'Gombak', 'Hulu Langat', 'Kuala Selangor', 'Sabak Bernam'],
  'Terengganu': ['Terengganu', 'Kuala Terengganu', 'Dungun'],
  'Kuala Lumpur': ['Kuala Lumpur', 'WP KL', 'W.P. Kuala Lumpur', 'Cheras', 'Kepong', 'WILAYAH PERSEKUTUAN KUALA LUMPUR'],
  'Labuan': ['Labuan', 'WP Labuan', 'W.P. Labuan', 'WILAYAH PERSEKUTUAN LABUAN'],
  'Putrajaya': ['Putrajaya', 'WP Putrajaya', 'W.P. Putrajaya', 'WILAYAH PERSEKUTUAN PUTRAJAYA']
}

// Group cities by State for the bottom listing - now tracks PPD for each city
const citiesByState = computed(() => {
  const groups = {}
  const cityPPDMap = {} // Track which PPD each city belongs to for each state
  
  // Initialize with actual negeri options from server (dynamic based on database)
  negeriOptions.value.forEach(negeri => {
    groups[negeri] = []
    cityPPDMap[negeri] = {}
  })
  
  // Add cities directly by negeri (bandar is matched with negeri only)
  Object.entries(citiesByNegeriData.value).forEach(([negeri, cities]) => {
    if (groups[negeri]) {
      cities.forEach(city => {
        groups[negeri].push(city)
        cityPPDMap[negeri][city] = negeri // Use negeri as the reference
      })
    }
  })
  
  // Sort cities alphabetically for each state and remove duplicates
  Object.keys(groups).forEach(state => {
    const uniqueCities = []
    const seen = new Set()
    
    groups[state].forEach(city => {
      if (!seen.has(city)) {
        seen.add(city)
        uniqueCities.push(city)
      }
    })
    
    uniqueCities.sort()
    groups[state] = uniqueCities
  })
  
  // Store the PPD mapping for getCityCount to use
  cityToPPDMap.value = cityPPDMap
  
  return groups
})

// Reset dependent filters when negeri changes
watch(selectedNegeri, () => {
  selectedPPD.value = ''
  selectedCity.value = ''
})

// Reset city when PPD changes
watch(selectedPPD, () => {
  selectedCity.value = ''
})

// Reset PPD when city is selected (mutual exclusion)
watch(selectedCity, () => {
  selectedPPD.value = ''
})

const fetchFeaturedSchools = async () => {
  try {
    loading.value = true
    await schoolStore.fetchSchools({ limit: 50 })
    const schools = schoolStore.schools
    if (schools.length > 0) {
      const shuffled = [...schools].sort(() => 0.5 - Math.random())
      featuredSchools.value = shuffled.slice(0, 3)
    }
  } catch (error) {
    console.error('Error fetching featured schools:', error)
  } finally {
    loading.value = false
  }
}

const fetchPPDData = async () => {
  try {
    // Fetch schools to extract PPD and city data
    await schoolStore.fetchSchools({ limit: 10000 })
    const schools = schoolStore.schools
    
    // Group cities by PPD and count schools
    const data = {}
    const ppds = new Set()
    const countsByState = {}
    const countsByCity = {}
    const jenisSet = new Set() // Collect actual jenis values from database
    const negeriPPDMap = {} // negeri -> ppds
    
    // Collect cities directly by negeri (bandar → negeri, not bandar → PPD → negeri)
    const citiesByNegeri = {}
    
    schools.forEach(school => {
      // Collect jenis data
      if (school.jenis) {
        jenisSet.add(school.jenis)
      }
      
      // Collect PPD data
      if (school.ppd) {
        ppds.add(school.ppd)
        
        // Map PPD to negeri (normalize negeri name)
        if (school.negeri) {
          let normalizedNegeri = school.negeri
          const lowerNegeri = normalizedNegeri.toLowerCase()
          if (lowerNegeri.includes('negeri sembilan')) normalizedNegeri = 'Negeri Sembilan'
          else if (lowerNegeri.includes('pulau pinang')) normalizedNegeri = 'Pulau Pinang'
          else if (lowerNegeri.includes('kuala lumpur')) normalizedNegeri = 'Kuala Lumpur'
          else if (lowerNegeri.includes('labuan')) normalizedNegeri = 'Labuan'
          else if (lowerNegeri.includes('putrajaya')) normalizedNegeri = 'Putrajaya'
          
          if (!negeriPPDMap[normalizedNegeri]) {
            negeriPPDMap[normalizedNegeri] = new Set()
          }
          negeriPPDMap[normalizedNegeri].add(school.ppd)
        }
      }
      
      // Collect cities by negeri directly (bandar matched with negeri only)
      // Normalize negeri name
      let normalizedNegeri = school.negeri
      if (normalizedNegeri) {
        const lowerNegeri = normalizedNegeri.toLowerCase()
        if (lowerNegeri.includes('negeri sembilan')) normalizedNegeri = 'Negeri Sembilan'
        else if (lowerNegeri.includes('pulau pinang')) normalizedNegeri = 'Pulau Pinang'
        else if (lowerNegeri.includes('kuala lumpur')) normalizedNegeri = 'Kuala Lumpur'
        else if (lowerNegeri.includes('labuan')) normalizedNegeri = 'Labuan'
        else if (lowerNegeri.includes('putrajaya')) normalizedNegeri = 'Putrajaya'
        
        if (school.bandar) {
          if (!citiesByNegeri[normalizedNegeri]) {
            citiesByNegeri[normalizedNegeri] = new Set()
          }
          citiesByNegeri[normalizedNegeri].add(school.bandar)
          
          // Count schools per city per negeri
          const cityKey = `${normalizedNegeri}-${school.bandar}`
          countsByCity[cityKey] = (countsByCity[cityKey] || 0) + 1
        }
      }
    })
    
    // Count schools per state using normalized negeri names
    // Initialize with negeriOptions from API (dynamic)
    negeriOptions.value.forEach(negeri => {
      countsByState[negeri] = 0
    })
    
    let totalCounted = 0
    let schoolsWithoutNegeri = 0
    
    schools.forEach(school => {
      if (school.negeri) {
        // Normalize negeri name
        let normalizedNegeri = school.negeri
        const lowerNegeri = normalizedNegeri.toLowerCase()
        if (lowerNegeri.includes('negeri sembilan')) normalizedNegeri = 'Negeri Sembilan'
        else if (lowerNegeri.includes('pulau pinang')) normalizedNegeri = 'Pulau Pinang'
        else if (lowerNegeri.includes('kuala lumpur')) normalizedNegeri = 'Kuala Lumpur'
        else if (lowerNegeri.includes('labuan')) normalizedNegeri = 'Labuan'
        else if (lowerNegeri.includes('putrajaya')) normalizedNegeri = 'Putrajaya'
        
        // Count by normalized negeri
        if (countsByState.hasOwnProperty(normalizedNegeri)) {
          countsByState[normalizedNegeri]++
          totalCounted++
        }
      } else {
        schoolsWithoutNegeri++
      }
    })
    
    // Convert negeri to PPD mapping sets to arrays
    Object.keys(negeriPPDMap).forEach(negeri => {
      negeriPPDMap[negeri] = Array.from(negeriPPDMap[negeri]).sort()
    })
    
    negeriToPPDMap.value = negeriPPDMap
    
    // Store cities by negeri data
    citiesByNegeriData.value = {}
    Object.keys(citiesByNegeri).forEach(negeri => {
      citiesByNegeriData.value[negeri] = Array.from(citiesByNegeri[negeri]).sort()
    })
    
    // Convert sets to sorted arrays
    ppdOptions.value = Array.from(ppds).sort()
    
    // Fetch negeri counts from server for accuracy
    await schoolStore.fetchFilterOptions()
    const filterData = schoolStore.filterOptions
    
    // Set negeri options from server
    negeriOptions.value = filterData.negeris || []

    // Set jenis options from database
    jenisOptions.value = Array.from(jenisSet).sort().map(jenis => ({ value: jenis, label: jenis }))
    
    // Store counts - use server negeri counts (accurate), but normalize state names
    // (handle casing differences like "Negeri sembilan" vs "Negeri Sembilan")
    const normalizedNegeriCounts = {}
    negeriOptions.value.forEach(state => {
      // Try exact match first, then case-insensitive match
      if (filterData.negeriCounts && filterData.negeriCounts[state]) {
        normalizedNegeriCounts[state] = filterData.negeriCounts[state]
      } else if (filterData.negeriCounts) {
        // Try to find a match ignoring case
        const match = Object.keys(filterData.negeriCounts).find(
          key => key.toLowerCase() === state.toLowerCase()
        )
        if (match) {
          normalizedNegeriCounts[state] = filterData.negeriCounts[match]
        } else {
          normalizedNegeriCounts[state] = 0
        }
      } else {
        normalizedNegeriCounts[state] = countsByState[state] || 0
      }
    })
    
    schoolCounts.value = {
      byState: normalizedNegeriCounts,
      byCity: countsByCity
    }
  } catch (error) {
    console.error('Error fetching PPD data:', error)
  }
}

const handleSearch = () => {
  loading.value = true
  const query = {}
  
  // Build query with all filter values
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedNegeri.value) query.negeri = selectedNegeri.value
  if (selectedPPD.value) query.ppd = selectedPPD.value
  if (selectedCity.value) query.bandar = selectedCity.value
  if (selectedJenis.value) query.jenis = selectedJenis.value
  
  console.log('Navigating to schools with query:', query)
  console.log('Current selections:', {
    negeri: selectedNegeri.value,
    ppd: selectedPPD.value,
    bandar: selectedCity.value,
    jenis: selectedJenis.value
  })
  
  // Navigate with filters
  router.push({
    path: '/schools',
    query: query
  })
  
  // Clear filters on landing page AFTER navigating
  searchQuery.value = ''
  selectedNegeri.value = ''
  selectedPPD.value = ''
  selectedCity.value = ''
  selectedJenis.value = ''
}

const viewSchool = (schoolId) => {
  router.push(`/schools/${schoolId}`)
}

const viewPPDSchools = (ppd) => {
  router.push({
    path: '/schools',
    query: { ppd: ppd }
  })
}

const viewCitySchools = (city) => {
  loading.value = true
  router.push({
    path: '/schools',
    query: { bandar: city }
  })
}

const viewStateSchools = (state) => {
  loading.value = true
  // Filter by negeri (state) to find ALL schools in that state (across all PPDs)
  router.push({
    path: '/schools',
    query: { negeri: state }
  })
}

// Helper function to get school count for a city in a specific state
const getCityCount = (state, city) => {
  // Use negeri-based key (bandar is matched directly with negeri)
  const cityKey = `${state}-${city}`
  return schoolCounts.value.byCity[cityKey] || 0
}

const toSentenceCase = (str) => {
  if (!str) return str
  return str.toLowerCase().replace(/(^|\s)\S/g, (match) => match.toUpperCase())
}

const toggleShowAllCities = (state) => {
  showAllCities.value[state] = !showAllCities.value[state]
}

const getSchoolImage = (school, index) => {
  if (school.logo_url) {
    return school.logo_url
  }
  const placeholders = [
    '/assets/img/b5bb1d0f54498b818b6b36f400570ad4.jpg',
    '/assets/img/2260da450baf521f55138b70666c90ca.jpg',
    '/assets/img/3f5cf9d18f2d4e340511338c40747f29.jpg'
  ]
  return placeholders[index % placeholders.length]
}

onMounted(async () => {
  // Clear previous data to ensure fresh fetch
  negeriOptions.value = []
  ppdOptions.value = []
  citiesByNegeriData.value = {}
  showAllCities.value = {}
  schoolStore.clearFilters()
  
  await fetchPPDData()
  await fetchFeaturedSchools()
})

onActivated(async () => {
  // Re-fetch data when component becomes active again (e.g., from back button)
  negeriOptions.value = []
  ppdOptions.value = []
  citiesByNegeriData.value = {}
  showAllCities.value = {}
  schoolStore.clearFilters()
  
  await fetchPPDData()
  await fetchFeaturedSchools()
})
</script>

<template>
  <section id="schools" class="py-20 bg-softGreen/30 dark:bg-gray-900 transition-colors duration-300 relative">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-heritageTeal mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">Mencari sekolah...</p>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-12 fade-in">
        <div>
           <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">{{ t('school.title') }}</h2>
           <p class="jakarta text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {{ t('school.subtitle') }}
           </p>
        </div>
        <router-link to="/schools" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline">{{ t('school.view_all') }} →</router-link>
      </div>

      <!-- Featured Schools Title -->
      <div class="mb-8 fade-in">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Featured Schools</h3>
        <p class="text-gray-600 dark:text-gray-400">Discover some of our highlighted schools</p>
      </div>

      <div v-if="featuredSchools.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div 
          v-for="(school, index) in featuredSchools" 
          :key="school.id"
          class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 fade-in cursor-pointer p-4"
          :class="index === 0 ? 'sticky-card' : index === 1 ? 'sticky-card-blue' : 'sticky-card-green'"
          :style="{ animationDelay: index * 0.1 + 's' }"
          @click="viewSchool(school.id)"
        >
          <div class="h-48 rounded-lg overflow-hidden mb-4">
            <img 
              :src="getSchoolImage(school, index)" 
              :alt="school.nama_sekolah"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-gray-900">{{ school.nama_sekolah }}</h3>
          <p class="jakarta text-gray-600 dark:text-gray-800 text-sm mb-4">
            📍 {{ school.bandar || school.ppd }} • {{ school.jenis }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ school.jumlah_murid || 0 }} students</span>
            <button class="text-gray-400 hover:text-heritageTeal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl p-4 animate-pulse">
          <div class="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-6 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="max-w-4xl mx-auto mb-8 fade-in">
        <div class="relative">
          <input 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text" 
            :placeholder="t('school.search_placeholder') || 'Cari nama sekolah, kod sekolah, bandar...'" 
            class="w-full px-6 py-5 pr-20 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-4 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white shadow-lg"
          />
          <button 
            @click="handleSearch" 
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-mantapOrange hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Cari
            </span>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="max-w-5xl mx-auto mb-12 fade-in bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
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
              <div class="w-full">
                <select 
                  v-model="selectedPPD"
                  :disabled="!selectedNegeri"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                 <option value="">Semua PPD</option>
                 <option v-for="ppd in filterPPDs" :key="ppd" :value="ppd">
                   {{ ppd }}
                 </option>
               </select>
             </div>
              <div class="w-full">
                <select 
                  v-model="selectedCity"
                  :disabled="!selectedNegeri"
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                 <option value="">Semua Bandar</option>
                 <option v-for="city in filterCities" :key="city" :value="city">
                    {{ toSentenceCase(city) }}
                 </option>
               </select>
             </div>
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

      <!-- State and City Listings - Compact -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 fade-in dark:text-gray-300">
        <div 
          v-for="state in negeriOptions" 
          :key="state"
          class="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-white/30"
        >
          <div class="text-2xl">💼</div>
          <div class="flex-1 min-w-0">
            <h4 
              class="font-bold text-base dark:text-white mb-1 cursor-pointer hover:text-heritageTeal transition-colors truncate"
              @click="viewStateSchools(state)"
            >
              {{ state }} ({{ schoolCounts.byState[state] || 0 }})
            </h4>
            <div v-if="citiesByState[state] && citiesByState[state].length > 0" class="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                <span 
                v-for="(city, index) in (showAllCities[state] ? citiesByState[state] : citiesByState[state].slice(0, 6))" 
                :key="city"
                class="cursor-pointer hover:text-heritageTeal transition-colors"
                @click="viewCitySchools(city)"
              >
                {{ toSentenceCase(city) }} ({{ getCityCount(state, city) }})<span v-if="index < (showAllCities[state] ? citiesByState[state].length - 1 : Math.min(citiesByState[state].length, 6) - 1)">, </span>
              </span>
              <button 
                v-if="citiesByState[state].length > 6" 
                @click="toggleShowAllCities(state)"
                class="text-heritageTeal hover:underline ml-1 font-medium"
              >
                {{ showAllCities[state] ? 'kurang...' : 'lagi...' }}
              </button>
            </div>
            <div v-else class="text-xs text-gray-400 italic">
              Tiada bandar
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 text-center md:hidden">
        <router-link to="/schools" class="jakarta text-heritageTeal font-bold hover:underline">{{ t('school.view_all') }} →</router-link>
      </div>

    </div>
  </section>
</template>

<style scoped>
.sticky-card {
  background: linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: rotate(-1deg);
  transition: all 0.3s ease;
}

.sticky-card:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sticky-card-blue {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: rotate(1deg);
  transition: all 0.3s ease;
}

.sticky-card-blue:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sticky-card-green {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: rotate(-1deg);
  transition: all 0.3s ease;
}

.sticky-card-green:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
