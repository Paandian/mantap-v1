<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
        <a href="#" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline">{{ t('school.view_all') }} →</a>
      </div>

      <!-- Featured Schools (Sticky Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- School 1 -->
        <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 fade-in sticky-card p-4">
          <div class="h-48 rounded-lg overflow-hidden mb-4">
            <img src="/assets/img/b5bb1d0f54498b818b6b36f400570ad4.jpg" alt="SMK Taman Jaya" class="w-full h-full object-cover">
          </div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-gray-900">SMK Taman Jaya</h3>
          <p class="jakarta text-gray-600 dark:text-gray-800 text-sm mb-4">📍 Kuala Lumpur • Sekolah Menengah</p>
          <div class="flex justify-between items-center">
            <button class="text-gray-400 hover:text-heritageTeal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- School 2 -->
        <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 fade-in sticky-card-blue p-4" style="animation-delay: 0.1s">
          <div class="h-48 rounded-lg overflow-hidden mb-4">
            <img src="/assets/img/2260da450baf521f55138b70666c90ca.jpg" alt="SMK Bandar Utama" class="w-full h-full object-cover">
          </div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-gray-900">SMK Bandar Utama</h3>
          <p class="jakarta text-gray-600 dark:text-gray-800 text-sm mb-4">📍 Petaling Jaya • Sekolah Menengah</p>
          <div class="flex justify-between items-center">
            <button class="text-gray-400 hover:text-heritageTeal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- School 3 -->
        <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 fade-in sticky-card-green p-4" style="animation-delay: 0.2s">
          <div class="h-48 rounded-lg overflow-hidden mb-4">
            <img src="/assets/img/3f5cf9d18f2d4e340511338c40747f29.jpg" alt="Kolej Vokasional Shah Alam" class="w-full h-full object-cover">
          </div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-gray-900">Kolej Vokasional Shah Alam</h3>
          <p class="jakarta text-gray-600 dark:text-gray-800 text-sm mb-4">📍 Shah Alam • Kolej Vokasional</p>
          <div class="flex justify-between items-center">
            <button class="text-gray-400 hover:text-heritageTeal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

       <!-- Search & Filters -->
      <div class="max-w-4xl mx-auto mb-16 fade-in bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 transition-colors duration-300">
        <h3 class="jakarta font-bold text-xl mb-4 text-center dark:text-white">Cari Mengikut Lokasi & Kategori</h3>
        <div class="flex flex-col md:flex-row gap-4">
           <div class="flex-grow">
             <input type="text" :placeholder="t('school.search_placeholder')" class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white">
           </div>
           <div class="md:w-1/4">
             <select class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white">
               <option value="">{{ t('school.filters.state') }}</option>
               <option value="johor">Johor</option>
               <option value="selangor">Selangor</option>
               <option value="kl">Kuala Lumpur</option>
               <option value="penang">Pulau Pinang</option>
             </select>
           </div>
           <div class="md:w-1/4">
             <select class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white">
               <option value="">{{ t('school.filters.category') }}</option>
               <option value="sk">Sek. Kebangsaan</option>
               <option value="smk">Sek. Menengah</option>
               <option value="sjkc">SJK(C)</option>
               <option value="int">International</option>
             </select>
           </div>
           <button class="bg-mantapOrange text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
             {{ t('school.search_btn') }}
           </button>
        </div>
      </div>

      <!-- Categorized Listing (States) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 fade-in dark:text-gray-300">
        <!-- Item -->
        <div class="flex items-start space-x-4">
          <div class="text-3xl">💼</div>
          <div>
            <h4 class="font-bold text-lg dark:text-white">Johor (1186)</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Batu Pahat, Johor Bahru, Kluang, Kota Tinggi, Kulai, Masai, Mersing, Muar, Pagoh, Pasir Gudang, Pontian, Skudai, Tangkak, Yong Peng, <a href="#" class="text-heritageTeal hover:underline">more...</a>
            </p>
          </div>
        </div>
        <!-- Item -->
        <div class="flex items-start space-x-4">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Kedah (748)</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Alor Setar, Baling, Gurun, Jitra, Kuala Ketil, Kuala Nerang, Kulim, Langkawi, Pendang, Sik, Sungai Petani, Yan, <a href="#" class="text-heritageTeal hover:underline">more...</a>
             </p>
          </div>
        </div>
        <!-- Item -->
         <div class="flex items-start space-x-4">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Kelantan (595)</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Bachok, Gua Musang, Kota Bharu, Kuala Krai, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Wakaf Bharu, <a href="#" class="text-heritageTeal hover:underline">more...</a>
             </p>
          </div>
        </div>
        <!-- Item -->
         <div class="flex items-start space-x-4">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Selangor (937)</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Ampang, Banting, Batu Caves, Cheras, Kajang, Klang, Pelabuhan Klang, Petaling Jaya, Puchong, Rawang, Semenyih, Shah Alam, Subang Jaya, Sungai Buloh, <a href="#" class="text-heritageTeal hover:underline">more...</a>
             </p>
          </div>
        </div>
        <!-- Item -->
         <div class="flex items-start space-x-4">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">W.P. Kuala Lumpur (353)</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Bandar Tasik Selatan, Cheras, Kepong, Kuala Lumpur, Setapak, Wangsa Maju, Bangsar, Brickfields, <a href="#" class="text-heritageTeal hover:underline">more...</a>
             </p>
          </div>
        </div>
        <!-- Item -->
         <div class="flex items-start space-x-4">
          <div class="text-3xl">💼</div>
          <div>
             <h4 class="font-bold text-lg dark:text-white">Pulau Pinang (399)</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Ayer Itam, Balik Pulau, Bayan Lepas, Bukit Mertajam, Butterworth, Georgetown, Kepala Batas, Nibong Tebal, Penang, Perai, <a href="#" class="text-heritageTeal hover:underline">more...</a>
             </p>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center md:hidden">
        <a href="#" class="jakarta text-heritageTeal font-bold hover:underline">{{ t('school.view_all') }} →</a>
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
