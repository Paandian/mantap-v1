<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section id="tools" class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-12 fade-in">
        <div>
          <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">{{ t('tools.title') }}</h2>
          <p class="jakarta text-lg text-gray-600 dark:text-gray-400">{{ t('tools.subtitle') }}</p>
        </div>
        <a href="#" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline">{{ t('tools.view_all') }} →</a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Tool 1 -->
        <div class="bg-lightBlue dark:bg-blue-900/40 p-6 rounded-2xl fade-in group cursor-pointer hover:shadow-lg transition-all">
          <div class="text-4xl mb-4">📝</div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-white">Kuiz Maker</h3>
          <p class="jakarta text-sm text-gray-600 dark:text-gray-300 mb-4">Buat kuiz interaktif untuk ulangkaji pantas.</p>
          <button class="text-heritageTeal font-bold text-sm group-hover:underline">Cuba Sekarang →</button>
        </div>

        <!-- Tool 2 -->
        <div class="bg-softGreen dark:bg-green-900/40 p-6 rounded-2xl fade-in group cursor-pointer hover:shadow-lg transition-all" style="animation-delay: 0.1s">
          <div class="text-4xl mb-4">📅</div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-white">Jadual Belajar</h3>
          <p class="jakarta text-sm text-gray-600 dark:text-gray-300 mb-4">Rancang masa belajar anda dengan lebih efisien.</p>
          <button class="text-heritageTeal font-bold text-sm group-hover:underline">Bina Jadual →</button>
        </div>

        <!-- Tool 3 -->
        <div class="bg-warmPink dark:bg-pink-900/40 p-6 rounded-2xl fade-in group cursor-pointer hover:shadow-lg transition-all" style="animation-delay: 0.2s">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-white">Analisis Prestasi</h3>
          <p class="jakarta text-sm text-gray-600 dark:text-gray-300 mb-4">Jejak kemajuan akademik anda dalam satu platform.</p>
          <button class="text-heritageTeal font-bold text-sm group-hover:underline">Lihat Demo →</button>
        </div>

        <!-- Tool 4 -->
        <div class="bg-stickyYellow dark:bg-yellow-900/40 p-6 rounded-2xl fade-in group cursor-pointer hover:shadow-lg transition-all" style="animation-delay: 0.3s">
          <div class="text-4xl mb-4">🤖</div>
          <h3 class="jakarta font-bold text-xl mb-2 dark:text-white">Tanya AI Cikgu</h3>
          <p class="jakarta text-sm text-gray-600 dark:text-gray-300 mb-4">Dapatkan jawapan segera untuk soalan susah.</p>
          <button class="text-heritageTeal font-bold text-sm group-hover:underline">Tanya Sekarang →</button>
        </div>
      </div>
      
       <div class="mt-8 text-center md:hidden">
        <a href="#" class="jakarta text-heritageTeal font-bold hover:underline">{{ t('tools.view_all') }} →</a>
      </div>
    </div>
  </section>
</template>
