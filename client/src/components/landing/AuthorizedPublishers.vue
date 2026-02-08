<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section id="publishers" class="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-12 fade-in">
        <div>
           <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">{{ t('publisher.title') }}</h2>
           <p class="jakarta text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {{ t('publisher.subtitle') }}
           </p>
        </div>
        <a href="#" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline">{{ t('publisher.view_all') }} →</a>
      </div>

       <!-- Search & Filters -->
      <div class="max-w-3xl mx-auto mb-16 fade-in bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="flex flex-col md:flex-row gap-4">
           <div class="flex-grow">
             <input type="text" :placeholder="t('publisher.search_placeholder')" class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none transition-all bg-white dark:bg-gray-700 dark:text-white">
           </div>
           <div class="md:w-1/3">
             <select class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-heritageTeal focus:ring-2 focus:ring-heritageTeal/20 outline-none bg-white dark:bg-gray-700 dark:text-white">
               <option value="">{{ t('publisher.filters.level') }}</option>
               <option value="preschool">Prasekolah</option>
               <option value="primary">Sekolah Rendah</option>
               <option value="secondary">Sekolah Menengah</option>
               <option value="university">Universiti</option>
             </select>
           </div>
           <button class="bg-mantapOrange text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
             {{ t('publisher.search_btn') }}
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <!-- Publisher 1 -->
        <div class="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-mantapOrange hover:shadow-xl transition-all duration-300 fade-in">
          <img src="/assets/img/e011c393dab52e9f097f6adb930628b4.jpg" alt="Dewan Bahasa dan Pustaka" class="w-full h-40 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-2xl mb-2 dark:text-white">Dewan Bahasa dan Pustaka</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Penerbit rasmi Malaysia untuk buku teks dan rujukan.</p>
        </div>

        <!-- Publisher 2 -->
        <div class="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-mantapOrange hover:shadow-xl transition-all duration-300 fade-in" style="animation-delay: 0.1s">
          <img src="/assets/img/2c7f32b62e26f8f43f252ae90bf7c4eb.jpg" alt="Oxford University Press" class="w-full h-40 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-2xl mb-2 dark:text-white">Oxford University Press</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Penerbit antarabangsa dengan kandungan berkualiti tinggi.</p>
        </div>

        <!-- Publisher 3 -->
        <div class="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-mantapOrange hover:shadow-xl transition-all duration-300 fade-in" style="animation-delay: 0.2s">
          <img src="/assets/img/0ab217010357747b8055808ae7701ba5.jpg" alt="Pearson Education" class="w-full h-40 object-cover rounded-lg mb-4">
          <h3 class="jakarta font-bold text-2xl mb-2 dark:text-white">Pearson Education</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Pemimpin global dalam penerbitan pendidikan.</p>
        </div>
      </div>

       <div class="mt-8 text-center md:hidden">
        <a href="#" class="jakarta text-heritageTeal font-bold hover:underline">{{ t('publisher.view_all') }} →</a>
      </div>
    </div>
  </section>
</template>
