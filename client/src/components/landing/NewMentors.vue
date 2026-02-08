<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section id="mentors" class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-12 fade-in">
        <div>
          <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"> {{ t('mentor.title') }}</h2>
          <p class="jakarta text-lg text-gray-600 dark:text-gray-400"> {{ t('mentor.subtitle') }}</p>
        </div>
        <a href="#" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline"> {{ t('mentor.view_all') }} →</a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Mentor 1 -->
        <div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 fade-in bg-white dark:bg-gray-800">
          <img src="/assets/img/58a335a400f4e8b4760ed5f363501fac.jpg" alt="Aisyah Binti" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <h3 class="jakarta text-white font-bold text-xl">Aisyah Binti</h3>
            <p class="jakarta text-gray-300 text-sm">Mentor Kerjaya IT</p>
            <div class="mt-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button class="w-full bg-mantapOrange text-white py-2 rounded-lg font-semibold text-sm"> {{ t('mentor.view_profile') }}</button>
            </div>
          </div>
        </div>

        <!-- Mentor 2 -->
        <div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 fade-in bg-white dark:bg-gray-800" style="animation-delay: 0.1s">
          <img src="/assets/img/f6761d35464192c0e2f401883cfcb7ae.jpg" alt="Rahman bin Salleh" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <h3 class="jakarta text-white font-bold text-xl">Rahman bin Salleh</h3>
            <p class="jakarta text-gray-300 text-sm">Mentor Perniagaan</p>
            <div class="mt-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button class="w-full bg-mantapOrange text-white py-2 rounded-lg font-semibold text-sm"> {{ t('mentor.view_profile') }}</button>
            </div>
          </div>
        </div>

        <!-- Mentor 3 -->
        <div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 fade-in bg-white dark:bg-gray-800" style="animation-delay: 0.2s">
          <img src="/assets/img/58a335a400f4e8b4760ed5f363501fac.jpg" alt="Nur Aini" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <h3 class="jakarta text-white font-bold text-xl">Nur Aini</h3>
            <p class="jakarta text-gray-300 text-sm">Mentor Seni & Kreativiti</p>
            <div class="mt-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button class="w-full bg-mantapOrange text-white py-2 rounded-lg font-semibold text-sm"> {{ t('mentor.view_profile') }}</button>
            </div>
          </div>
        </div>

        <!-- Mentor 4 -->
        <div class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 fade-in bg-white dark:bg-gray-800" style="animation-delay: 0.3s">
          <img src="/assets/img/97ed7da16e3b8aed2b7ed63f4d8a491b.jpg" alt="Hafiz bin Omar" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <h3 class="jakarta text-white font-bold text-xl">Hafiz bin Omar</h3>
            <p class="jakarta text-gray-300 text-sm">Mentor Sukan</p>
            <div class="mt-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button class="w-full bg-mantapOrange text-white py-2 rounded-lg font-semibold text-sm"> {{ t('mentor.view_profile') }}</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center md:hidden">
        <a href="#" class="jakarta text-heritageTeal font-bold hover:underline"> {{ t('mentor.view_all') }} →</a>
      </div>
    </div>
  </section>
</template>
