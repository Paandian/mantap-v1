<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section id="merchants" class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-12 fade-in">
        <div>
           <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">{{ t('merchant.title') }}</h2>
           <p class="jakarta text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {{ t('merchant.subtitle') }}
           </p>
        </div>
        <a href="#" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline">{{ t('merchant.view_all') }} →</a>
      </div>

       <!-- Search & Filters -->
      <div class="max-w-3xl mx-auto mb-16 fade-in bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div class="flex flex-col md:flex-row gap-4">
           <div class="flex-grow">
             <input type="text" :placeholder="t('merchant.search_placeholder')" class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white">
           </div>
           <div class="md:w-1/3">
             <select class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white">
               <option value="">{{ t('merchant.filters.category') }}</option>
               <option value="books">Buku & Rujukan</option>
               <option value="stationery">Alat Tulis</option>
               <option value="tech">Teknologi</option>
               <option value="uniform">Pakaian</option>
             </select>
           </div>
           <button class="bg-mantapOrange text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
             {{ t('merchant.search_btn') }}
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Item 1 -->
        <div class="sticky-card p-6 rounded-2xl bg-gray-50 hover:bg-lightBlue transition-colors duration-300 fade-in group cursor-pointer">
          <img src="/assets/img/3f980d1cf710f29e89c5b8c22657216f.jpg" alt="EduBooks Sdn Bhd" class="w-full h-32 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-gray-900 mb-1 dark:text-gray-900">EduBooks Sdn Bhd</h3>
          <p class="jakarta text-sm text-gray-500">Buku Teks & Rujukan</p>
          <span class="jakarta text-xs bg-heritageTeal text-white px-3 py-1 rounded-full mt-2 inline-block">Disahkan</span>
        </div>

        <!-- Item 2 -->
        <div class="sticky-card-blue p-6 rounded-2xl bg-gray-50 hover:bg-lightBlue transition-colors duration-300 fade-in group cursor-pointer" style="animation-delay: 0.1s">
          <img src="/assets/img/b4c52b3cdf5dcd4b844d0482e05da04e.jpg" alt="Stationery Hub" class="w-full h-32 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-gray-900 mb-1 dark:text-gray-900">Stationery Hub</h3>
          <p class="jakarta text-sm text-gray-500">Alat Tulis & Peralatan</p>
          <span class="jakarta text-xs bg-heritageTeal text-white px-3 py-1 rounded-full mt-2 inline-block">Disahkan</span>
        </div>

        <!-- Item 3 -->
        <div class="sticky-card-green p-6 rounded-2xl bg-gray-50 hover:bg-lightBlue transition-colors duration-300 fade-in group cursor-pointer" style="animation-delay: 0.2s">
          <img src="/assets/img/bc8eb53245d48e57d04cb69676343a07.jpg" alt="TechEd Solutions" class="w-full h-32 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-gray-900 mb-1 dark:text-gray-900">TechEd Solutions</h3>
          <p class="jakarta text-sm text-gray-500">Teknologi Pendidikan</p>
          <span class="jakarta text-xs bg-heritageTeal text-white px-3 py-1 rounded-full mt-2 inline-block">Disahkan</span>
        </div>

        <!-- Item 4 -->
        <div class="sticky-card-pink p-6 rounded-2xl bg-gray-50 hover:bg-lightBlue transition-colors duration-300 fade-in group cursor-pointer" style="animation-delay: 0.3s">
          <img src="/assets/img/7926ce094da3e3f0bf54bacb893bfddd.jpg" alt="Learning Resources" class="w-full h-32 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-gray-900 mb-1 dark:text-gray-900">Learning Resources</h3>
          <p class="jakarta text-sm text-gray-500">Sumber Pembelajaran</p>
          <span class="jakarta text-xs bg-heritageTeal text-white px-3 py-1 rounded-full mt-2 inline-block">Disahkan</span>
        </div>
      </div>

       <div class="mt-8 text-center md:hidden">
        <a href="#" class="jakarta text-heritageTeal font-bold hover:underline">{{ t('merchant.view_all') }} →</a>
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

.sticky-card-pink {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: rotate(1deg);
  transition: all 0.3s ease;
}

.sticky-card-pink:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
