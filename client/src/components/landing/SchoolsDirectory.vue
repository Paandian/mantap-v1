<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from '@/stores/schools'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const schoolStore = useSchoolStore()

const featuredSchools = ref([])
const searchQuery = ref('')
const selectedState = ref('')
const selectedType = ref('')
const selectedCity = ref('')
const loading = ref(false)
const showAllCities = ref({})
const stateCityData = ref({})

// Type options (Rendah/Menengah)
const typeOptions = [
  { value: 'Rendah', label: 'Sekolah Rendah' },
  { value: 'Menengah', label: 'Sekolah Menengah' }
]

// State options (16 Malaysian states)
const stateOptions = [
  { value: 'Johor', label: 'Johor' },
  { value: 'Kedah', label: 'Kedah' },
  { value: 'Kelantan', label: 'Kelantan' },
  { value: 'Melaka', label: 'Melaka' },
  { value: 'Negeri Sembilan', label: 'Negeri Sembilan' },
  { value: 'Pahang', label: 'Pahang' },
  { value: 'Perak', label: 'Perak' },
  { value: 'Perlis', label: 'Perlis' },
  { value: 'Pulau Pinang', label: 'Pulau Pinang' },
  { value: 'Sabah', label: 'Sabah' },
  { value: 'Sarawak', label: 'Sarawak' },
  { value: 'Selangor', label: 'Selangor' },
  { value: 'Terengganu', label: 'Terengganu' },
  { value: 'W.P. Kuala Lumpur', label: 'W.P. Kuala Lumpur' },
  { value: 'W.P. Labuan', label: 'W.P. Labuan' },
  { value: 'W.P. Putrajaya', label: 'W.P. Putrajaya' }
]

// Available cities based on selected state
const availableCities = computed(() => {
  if (!selectedState.value) return []
  return stateCityData.value[selectedState.value] || []
})

// Reset city when state changes
watch(selectedState, () => {
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

const fetchStateCityData = async () => {
  try {
    // Fetch all schools to extract state-city mapping
    const response = await schoolStore.fetchSchools({ limit: 10000 })
    const schools = schoolStore.schools
    
    // Group cities by state
    const data = {}
    schools.forEach(school => {
      if (school.negeri && school.bandar) {
        if (!data[school.negeri]) {
          data[school.negeri] = new Set()
        }
        data[school.negeri].add(school.bandar)
      }
    })
    
    // Convert sets to sorted arrays
    stateCityData.value = {}
    Object.keys(data).forEach(state => {
      stateCityData.value[state] = Array.from(data[state]).sort()
    })
  } catch (error) {
    console.error('Error fetching state-city data:', error)
  }
}

const handleSearch = () => {
  const query = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedState.value) query.negeri = selectedState.value
  if (selectedType.value) query.peringkat = selectedType.value
  if (selectedCity.value) query.bandar = selectedCity.value
  
  router.push({
    path: '/schools',
    query: query
  })
}

const viewSchool = (schoolId) => {
  router.push(`/schools/${schoolId}`)
}

const viewStateSchools = (state) => {
  router.push({
    path: '/schools',
    query: { negeri: state }
  })
}

const viewCitySchools = (city, state) => {
  router.push({
    path: '/schools',
    query: { bandar: city, negeri: state }
  })
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
  await Promise.all([
    fetchStateCityData(),
    fetchFeaturedSchools()
  ])
})
</script>

<template>
  <section id="schools" class="py-20 bg-softGreen/30 dark:bg-gray-900 transition-colors duration-300">
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
            📍 {{ school.bandar || school.negeri }} • {{ school.peringkat === 'Rendah' ? 'Sekolah Rendah' : 'Sekolah Menengah' }}
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
        <form @submit.prevent="handleSearch" class="relative">
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t('school.search_placeholder') || 'Cari nama sekolah, kod sekolah, bandar...'" 
            class="w-full px-6 py-5 pl-14 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-4 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white shadow-lg"
          />
          <svg class="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <button type="submit" class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-mantapOrange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors">
            Cari
          </button>
        </form>
      </div>

      <!-- Filters Section -->
      <div class="max-w-5xl mx-auto mb-16 fade-in bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
        <h3 class="jakarta font-bold text-lg mb-4 text-center dark:text-white text-gray-600">Tapis Mengikut</h3>
        <div class="flex flex-col md:flex-row gap-4">
           <div class="md:w-1/3">
             <select 
               v-model="selectedState"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white"
             >
               <option value="">Semua Negeri</option>
               <option v-for="state in stateOptions" :key="state.value" :value="state.value">
                 {{ state.label }}
               </option>
             </select>
           </div>
           <div class="md:w-1/3">
             <select 
               v-model="selectedCity"
               :disabled="!selectedState"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <option value="">Semua Bandar</option>
               <option v-for="city in availableCities" :key="city" :value="city">
                 {{ city }}
               </option>
             </select>
           </div>
           <div class="md:w-1/3">
             <select 
               v-model="selectedType"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white"
             >
               <option value="">Semua Peringkat</option>
               <option v-for="type in typeOptions" :key="type.value" :value="type.value">
                 {{ type.label }}
               </option>
             </select>
           </div>
        </div>
      </div>

      <!-- State and City Listings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 fade-in dark:text-gray-300">
        <div 
          v-for="state in stateOptions" 
          :key="state.value"
          class="flex items-start space-x-4 p-4 rounded-lg transition-colors hover:bg-white/50"
        >
          <div class="text-3xl">🏫</div>
          <div class="flex-1">
            <h4 
              class="font-bold text-lg dark:text-white mb-3 cursor-pointer hover:text-heritageTeal transition-colors" 
              @click="viewStateSchools(state.value)"
            >
              {{ state.label }}
            </h4>
            <div v-if="stateCityData[state.value] && stateCityData[state.value].length > 0" class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span 
                v-for="(city, index) in (showAllCities[state.value] ? stateCityData[state.value] : stateCityData[state.value].slice(0, 8))" 
                :key="city"
                class="cursor-pointer hover:text-heritageTeal transition-colors"
                @click="viewCitySchools(city, state.value)"
              >
                {{ city }}<span v-if="index < (showAllCities[state.value] ? stateCityData[state.value].length - 1 : Math.min(stateCityData[state.value].length, 8) - 1)">, </span>
              </span>
              <button 
                v-if="stateCityData[state.value].length > 8" 
                @click="toggleShowAllCities(state.value)"
                class="text-heritageTeal hover:underline ml-1 font-medium"
              >
                {{ showAllCities[state.value] ? 'kurang...' : 'lagi...' }}
              </button>
            </div>
            <div v-else class="text-sm text-gray-400 italic">
              Tiada bandar tersedia
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center md:hidden">
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
