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
const selectedPPD = ref('')
const selectedJenis = ref('')
const selectedCity = ref('')
const loading = ref(false)
const showAllCities = ref({})
const ppdCityData = ref({})
const ppdOptions = ref([])
const schoolCounts = ref({
  byState: {},
  byCity: {}
})

// Jenis options (RENDAH/MENENGAH from database)
const jenisOptions = [
  { value: 'RENDAH', label: 'RENDAH' },
  { value: 'MENENGAH', label: 'MENENGAH' }
]

// Available cities based on selected PPD
const availableCities = computed(() => {
  if (!selectedPPD.value) return []
  return ppdCityData.value[selectedPPD.value] || []
})

// Define 16 Malaysian states
const stateList = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 
  'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 
  'Sarawak', 'Selangor', 'Terengganu', 'W.P. Kuala Lumpur', 
  'W.P. Labuan', 'W.P. Putrajaya'
]

// State keywords for matching PPDs to states
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
  'W.P. Kuala Lumpur': ['Kuala Lumpur', 'WP KL', 'W.P. Kuala Lumpur', 'Cheras', 'Kepong'],
  'W.P. Labuan': ['Labuan', 'WP Labuan'],
  'W.P. Putrajaya': ['Putrajaya', 'WP Putrajaya']
}

// Group cities by State for the bottom listing
const citiesByState = computed(() => {
  const groups = {}
  
  // Initialize all 16 states with empty arrays
  stateList.forEach(state => {
    groups[state] = []
  })
  
  // Group PPDs by state and collect cities
  ppdOptions.value.forEach(ppd => {
    let matchedState = null
    
    // Try to match PPD to state using keywords
    for (const [state, keywords] of Object.entries(stateKeywords)) {
      if (keywords.some(keyword => ppd.toLowerCase().includes(keyword.toLowerCase()))) {
        matchedState = state
        break
      }
    }
    
    // Add cities from this PPD to the matched state
    if (matchedState && ppdCityData.value[ppd]) {
      const cities = ppdCityData.value[ppd]
      cities.forEach(city => {
        if (!groups[matchedState].includes(city)) {
          groups[matchedState].push(city)
        }
      })
    }
  })
  
  // Sort cities alphabetically for each state
  Object.keys(groups).forEach(state => {
    groups[state].sort()
  })
  
  return groups
})

// Reset city when PPD changes
watch(selectedPPD, () => {
  selectedCity.value = ''
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
    
    schools.forEach(school => {
      if (school.ppd) {
        ppds.add(school.ppd)
        
        // Count by city
        if (school.bandar) {
          if (!data[school.ppd]) {
            data[school.ppd] = new Set()
          }
          data[school.ppd].add(school.bandar)
          
          // Count schools per city
          const cityKey = `${school.ppd}-${school.bandar}`
          countsByCity[cityKey] = (countsByCity[cityKey] || 0) + 1
        }
      }
    })
    
    // Count schools per state by aggregating city counts
    stateList.forEach(state => {
      countsByState[state] = 0
      // Find all PPDs for this state
      ppds.forEach(ppd => {
        const keywords = stateKeywords[state] || [state]
        if (keywords.some(keyword => ppd.toLowerCase().includes(keyword.toLowerCase()))) {
          // Sum up all city counts for this PPD
          if (data[ppd]) {
            data[ppd].forEach(city => {
              const cityKey = `${ppd}-${city}`
              countsByState[state] += countsByCity[cityKey] || 0
            })
          }
        }
      })
    })
    
    // Convert sets to sorted arrays
    ppdOptions.value = Array.from(ppds).sort()
    ppdCityData.value = {}
    Object.keys(data).forEach(ppd => {
      ppdCityData.value[ppd] = Array.from(data[ppd]).sort()
    })
    
    // Store counts
    schoolCounts.value = {
      byState: countsByState,
      byCity: countsByCity
    }
  } catch (error) {
    console.error('Error fetching PPD data:', error)
  }
}

const handleSearch = () => {
  loading.value = true
  const query = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedPPD.value) query.ppd = selectedPPD.value
  if (selectedJenis.value) query.jenis = selectedJenis.value
  if (selectedCity.value) query.bandar = selectedCity.value
  
  // Clear filters on landing page before navigating
  searchQuery.value = ''
  selectedPPD.value = ''
  selectedCity.value = ''
  selectedJenis.value = ''
  
  router.push({
    path: '/schools',
    query: query
  })
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
  // Find the first PPD that matches this state to use as filter
  const matchingPPD = ppdOptions.value.find(ppd => {
    const keywords = stateKeywords[state] || [state]
    return keywords.some(keyword => ppd.toLowerCase().includes(keyword.toLowerCase()))
  })
  
  if (matchingPPD) {
    router.push({
      path: '/schools',
      query: { ppd: matchingPPD }
    })
  } else {
    // Fallback to search by state name
    router.push({
      path: '/schools',
      query: { search: state }
    })
  }
}

// Helper function to get school count for a city in a specific state
const getCityCount = (state, city) => {
  // Find which PPD this city belongs to based on the state
  for (const ppd of ppdOptions.value) {
    const keywords = stateKeywords[state] || [state]
    if (keywords.some(keyword => ppd.toLowerCase().includes(keyword.toLowerCase()))) {
      // Check if this city is in this PPD
      if (ppdCityData.value[ppd] && ppdCityData.value[ppd].includes(city)) {
        const cityKey = `${ppd}-${city}`
        return schoolCounts.value.byCity[cityKey] || 0
      }
    }
  }
  return 0
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
  ppdOptions.value = []
  ppdCityData.value = {}
  showAllCities.value = {}
  schoolStore.clearFilters()
  
  await fetchPPDData()
  await fetchFeaturedSchools()
})

onActivated(async () => {
  // Re-fetch data when component becomes active again (e.g., from back button)
  ppdOptions.value = []
  ppdCityData.value = {}
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
            type="text" 
            :placeholder="t('school.search_placeholder') || 'Cari nama sekolah, kod sekolah, bandar...'" 
            class="w-full px-6 py-5 pl-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-4 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white shadow-lg"
          />
          <svg class="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Filters Section with Search Button -->
      <div class="max-w-5xl mx-auto mb-12 fade-in bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
        <div class="flex flex-col md:flex-row gap-3 items-center">
           <div class="md:w-1/4 w-full">
             <select 
               v-model="selectedPPD"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white text-sm"
             >
               <option value="">Semua Negeri</option>
               <option v-for="ppd in ppdOptions" :key="ppd" :value="ppd">
                 {{ ppd }}
               </option>
             </select>
           </div>
           <div class="md:w-1/4 w-full">
             <select 
               v-model="selectedCity"
               :disabled="!selectedPPD"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
             >
               <option value="">Semua Bandar</option>
                <option v-for="city in availableCities" :key="city" :value="city">
                  {{ toSentenceCase(city) }}
                </option>
             </select>
           </div>
           <div class="md:w-1/4 w-full">
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
           <div class="md:w-1/4 w-full">
             <button 
               @click="handleSearch" 
               class="w-full bg-mantapOrange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-sm shadow-md hover:shadow-lg transition-all"
             >
               <span class="flex items-center justify-center gap-2">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                 </svg>
                 Cari
               </span>
             </button>
           </div>
        </div>
      </div>

      <!-- State and City Listings - Compact -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 fade-in dark:text-gray-300">
        <div 
          v-for="state in stateList" 
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
