<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <section id="tutors" class="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-end mb-16 fade-in">
        <div>
          <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
             {{ t('tutor.title') }}
          </h2>
          <p class="jakarta text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
             {{ t('tutor.subtitle') }}
          </p>
        </div>
        <a href="#" class="hidden md:block jakarta text-heritageTeal font-bold hover:underline"> {{ t('tutor.view_all') }} →</a>
      </div>

      <!-- Search Box -->
      <div class="max-w-3xl mx-auto mb-16 fade-in">
        <div class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg flex items-center transition-colors duration-300 border border-transparent dark:border-gray-700">
          <input type="text" :placeholder="t('tutor.search_placeholder')" class="jakarta flex-grow px-6 py-3 rounded-full text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none">
          <button class="jakarta bg-heritageTeal text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 transition-colors duration-200">
             {{ t('tutor.search_btn') }}
          </button>
        </div>
      </div>

      <!-- Tutor Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="sticky-card bg-white p-6 rounded-2xl fade-in group cursor-pointer">
          <div class="flex items-center space-x-4 mb-4">
            <img src="/assets/img/f6761d35464192c0e2f401883cfcb7ae.jpg" alt="Ahmad Rahman" class="w-16 h-16 rounded-full object-cover border-2 border-heritageTeal">
            <div>
              <h3 class="jakarta font-bold text-lg">Ahmad Rahman</h3>
              <div class="verified-badge">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ t('tutor.verified') }}
              </div>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">Matematik & Sains</p>
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">⭐ 4.9 (5 tahun {{ t('tutor.experience') }})</p>
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">📍 Kuala Lumpur</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="sticky-card-blue bg-white p-6 rounded-2xl fade-in group cursor-pointer" style="animation-delay: 0.1s">
          <div class="flex items-center space-x-4 mb-4">
            <img src="/assets/img/58a335a400f4e8b4760ed5f363501fac.jpg" alt="Siti Nurhaliza" class="w-16 h-16 rounded-full object-cover border-2 border-heritageTeal">
            <div>
              <h3 class="jakarta font-bold text-lg dark:text-gray-900">Siti Nurhaliza</h3>
              <div class="verified-badge">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ t('tutor.verified') }}
              </div>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">Bahasa Melayu & Inggeris</p>
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">⭐ 5.0 (8 tahun {{ t('tutor.experience') }})</p>
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">📍 Petaling Jaya</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="sticky-card-green bg-white p-6 rounded-2xl fade-in group cursor-pointer" style="animation-delay: 0.2s">
          <div class="flex items-center space-x-4 mb-4">
            <img src="/assets/img/97ed7da16e3b8aed2b7ed63f4d8a491b.jpg" alt="Muhammad Ali" class="w-16 h-16 rounded-full object-cover border-2 border-heritageTeal">
            <div>
              <h3 class="jakarta font-bold text-lg dark:text-gray-900">Muhammad Ali</h3>
              <div class="verified-badge">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ t('tutor.verified') }}
              </div>
            </div>
          </div>
          <div class="space-y-2 mb-4">
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">Fizik & Kimia</p>
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">⭐ 4.8 (6 tahun {{ t('tutor.experience') }})</p>
            <p class="jakarta text-gray-600 dark:text-gray-800 text-sm">📍 Shah Alam</p>
          </div>
        </div>
      </div>

       <div class="mt-8 text-center md:hidden">
        <a href="#" class="jakarta text-heritageTeal font-bold hover:underline"> {{ t('tutor.view_all') }} →</a>
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

.verified-badge {
  background: #0d9488;
  color: white;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
