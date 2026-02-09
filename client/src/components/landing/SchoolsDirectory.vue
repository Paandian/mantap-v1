<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from '@/stores/schools'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const schoolStore = useSchoolStore()

const featuredSchools = ref([])
const searchQuery = ref('')
const selectedState = ref('')
const selectedCategory = ref('')
const loading = ref(false)

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

const categoryOptions = [
  { value: 'SK', label: 'Sek. Kebangsaan' },
  { value: 'SMK', label: 'Sek. Menengah' },
  { value: 'SJKC', label: 'SJK(C)' },
  { value: 'SJKT', label: 'SJKT' },
  { value: 'SMJK', label: 'SMJK' }
]

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
  if (selectedState.value) query.negeri = selectedState.value
  if (selectedCategory.value) query.jenis = selectedCategory.value
  
  router.push({
    path: '/schools',
    query: query
  })
}

const viewSchool = (schoolId) => {
  router.push(`/schools/${schoolId}`)
}

const viewStateSchools = (stateName) => {
  router.push({
    path: '/schools',
    query: { negeri: stateName }
  })
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

onMounted(() => {
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

      <div class="max-w-4xl mx-auto mb-16 fade-in bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
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
           <div class="md:w-1/4">
             <select 
               v-model="selectedState"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white"
             >
               <option value="">{{ t('school.filters.state') }}</option>
               <option v-for="state in stateOptions" :key="state.value" :value="state.value">
                 {{ state.label }}
               </option>
             </select>
           </div>
           <div class="md:w-1/4">
             <select 
               v-model="selectedCategory"
               class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white"
             >
               <option value="">{{ t('school.filters.category') }}</option>
               <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                 {{ cat.label }}
               </option>
             </select>
           </div>
           <button type="submit" class="bg-mantapOrange text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
             {{ t('school.search_btn') }}
           </button>
        </form>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 fade-in dark:text-gray-300">
        <div class="flex items-start space-x-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors" @click="viewStateSchools('Johor')">
          <div class="text-3xl">💼</div>
          <div>
            <h4 class="font-bold text-lg dark:text-white">Johor</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Johor Bahru, Batu Pahat, Kluang, Kota Tinggi, Kulai, Masai, Mersing, Muar, Pagoh, Pasir Gudang, Pontian, Skudai, Tangkak, Yong Peng
            </p>
          </div>
        </div>
        <div class="flex items-start space-x-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors" @click="viewStateSchools('Kedah')">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Kedah</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Alor Setar, Baling, Gurun, Jitra, Kuala Ketil, Kuala Nerang, Kulim, Langkawi, Pendang, Sik, Sungai Petani, Yan
             </p>
          </div>
        </div>
        <div class="flex items-start space-x-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors" @click="viewStateSchools('Kelantan')">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Kelantan</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Bachok, Gua Musang, Kota Bharu, Kuala Krai, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Wakaf Bharu
             </p>
          </div>
        </div>
        <div class="flex items-start space-x-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors" @click="viewStateSchools('Selangor')">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Selangor</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Ampang, Banting, Batu Caves, Cheras, Kajang, Klang, Pelabuhan Klang, Petaling Jaya, Puchong, Rawang, Semenyih, Shah Alam, Subang Jaya, Sungai Buloh
             </p>
          </div>
        </div>
        <div class="flex items-start space-x-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors" @click="viewStateSchools('W.P. Kuala Lumpur')">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">W.P. Kuala Lumpur</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Bandar Tasik Selatan, Cheras, Kepong, Kuala Lumpur, Setapak, Wangsa Maju, Bangsar, Brickfields
             </p>
          </div>
        </div>
        <div class="flex items-start space-x-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors" @click="viewStateSchools('Pulau Pinang')">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Pulau Pinang</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Ayer Itam, Balik Pulau, Bayan Lepas, Bukit Mertajam, Butterworth, Georgetown, Kepala Batas, Nibong Tebal, Penang, Perai
             </p>
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
