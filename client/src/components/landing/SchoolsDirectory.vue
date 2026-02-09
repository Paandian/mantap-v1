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
const selectedPPD = ref('')
const selectedType = ref('')
const selectedCity = ref('')
const loading = ref(false)
const showAllCities = ref({})

// Type options (Rendah/Menengah)
const typeOptions = [
  { value: 'Rendah', label: 'Sekolah Rendah' },
  { value: 'Menengah', label: 'Sekolah Menengah' }
]

// Computed properties for filter options from store
const ppdOptions = computed(() => schoolStore.filterOptions.ppds || [])
const citiesByPPD = computed(() => schoolStore.filterOptions.cities || {})

// Available cities based on selected PPD
const availableCities = computed(() => {
  if (!selectedPPD.value) return []
  return citiesByPPD.value[selectedPPD.value] || []
})

// Group PPDs by State for the bottom listing
const ppdsByState = computed(() => {
  const groups = {}
  ppdOptions.value.forEach(ppd => {
    // Extract state from PPD name (e.g., "PPD Johor Bahru" -> "Johor")
    let state = 'Lain-lain'
    if (ppd.includes('Johor')) state = 'Johor'
    else if (ppd.includes('Kedah')) state = 'Kedah'
    else if (ppd.includes('Kelantan')) state = 'Kelantan'
    else if (ppd.includes('Melaka')) state = 'Melaka'
    else if (ppd.includes('Negeri Sembilan')) state = 'Negeri Sembilan'
    else if (ppd.includes('Pahang')) state = 'Pahang'
    else if (ppd.includes('Perak')) state = 'Perak'
    else if (ppd.includes('Perlis')) state = 'Perlis'
    else if (ppd.includes('Pulau Pinang') || ppd.includes('Penang')) state = 'Pulau Pinang'
    else if (ppd.includes('Sabah')) state = 'Sabah'
    else if (ppd.includes('Sarawak')) state = 'Sarawak'
    else if (ppd.includes('Selangor')) state = 'Selangor'
    else if (ppd.includes('Terengganu')) state = 'Terengganu'
    else if (ppd.includes('Kuala Lumpur') || ppd.includes('WP KL') || ppd.includes('W.P. Kuala Lumpur')) state = 'W.P. Kuala Lumpur'
    else if (ppd.includes('Labuan')) state = 'W.P. Labuan'
    else if (ppd.includes('Putrajaya')) state = 'W.P. Putrajaya'
    
    if (!groups[state]) {
      groups[state] = []
    }
    groups[state].push(ppd)
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

const handleSearch = () => {
  const query = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedPPD.value) query.ppd = selectedPPD.value
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

const viewPPDSchools = (ppd) => {
  router.push({
    path: '/schools',
    query: { ppd: ppd }
  })
}

const viewCitySchools = (city) => {
  router.push({
    path: '/schools',
    query: { bandar: city }
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
  await schoolStore.fetchFilterOptions()
  fetchFeaturedSchools()
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
            📍 {{ school.bandar || school.ppd }} • {{ school.peringkat === 'Rendah' ? 'Sekolah Rendah' : 'Sekolah Menengah' }}
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

      <div class="max-w-5xl mx-auto mb-16 fade-in bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
        <h3 class="jakarta font-bold text-xl mb-4 text-center dark:text-white">Cari Mengikut Lokasi & Kategori</h3>
        <form @submit.prevent="handleSearch" class="flex flex-col md:flex-row gap-4">
           <div class="flex-grow">
             <input 
               v-model="searchQuery"
               type="text" 
               :placeholder="t('school.search_placeholder')" 
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
             />
           </div>
           <div class="md:w-48">
             <select 
               v-model="selectedPPD"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white"
             >
               <option value="">Semua Daerah (PPD)</option>
               <option v-for="ppd in ppdOptions" :key="ppd" :value="ppd">
                 {{ ppd }}
               </option>
             </select>
           </div>
           <div class="md:w-40">
             <select 
               v-model="selectedCity"
               :disabled="!selectedPPD"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <option value="">Semua Bandar</option>
               <option v-for="city in availableCities" :key="city" :value="city">
                 {{ city }}
               </option>
             </select>
           </div>
           <div class="md:w-44">
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
           <button type="submit" class="bg-mantapOrange text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
             {{ t('school.search_btn') }}
           </button>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 fade-in dark:text-gray-300">
        <div 
          v-for="(ppds, state) in ppdsByState" 
          :key="state"
          class="flex items-start space-x-4 p-3 rounded-lg transition-colors hover:bg-white/50"
        >
          <div class="text-3xl">🏫</div>
          <div class="flex-1">
            <h4 class="font-bold text-lg dark:text-white mb-2 cursor-pointer hover:text-heritageTeal transition-colors" @click="viewPPDSchools(ppds[0])">
              {{ state }}
            </h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span 
                v-for="(ppd, index) in (showAllCities[state] ? ppds : ppds.slice(0, 4))" 
                :key="ppd"
                class="cursor-pointer hover:text-heritageTeal transition-colors"
                @click="viewPPDSchools(ppd)"
              >
                {{ ppd.replace('PPD ', '').replace('PPD', '') }}<span v-if="index < (showAllCities[state] ? ppds.length - 1 : Math.min(ppds.length, 4) - 1)">, </span>
              </span>
              <button 
                v-if="ppds.length > 4" 
                @click="toggleShowAllCities(state)"
                class="text-heritageTeal hover:underline ml-1 font-medium"
              >
                {{ showAllCities[state] ? '...kurang' : '...lagi' }}
              </button>
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
