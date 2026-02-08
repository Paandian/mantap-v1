<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const sliderRef = ref(null)
let sliderTween = null

onMounted(() => {
  if (sliderRef.value) {
    const sliderWidth = sliderRef.value.scrollWidth / 2
    
    sliderTween = gsap.to(sliderRef.value, {
      x: -sliderWidth,
      duration: 40,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % sliderWidth)
      }
    })
  }
})

const pauseSlider = () => {
  if (sliderTween) gsap.to(sliderTween, { timeScale: 0, duration: 0.3 })
}

const resumeSlider = () => {
  if (sliderTween) gsap.to(sliderTween, { timeScale: 1, duration: 0.3 })
}

onUnmounted(() => {
  if (sliderTween) sliderTween.kill()
})
</script>

<template>
  <section class="py-20 bg-gray-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="text-center fade-in">
        <h2 class="handwritten text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Apa Kata Komuniti?</h2>
      </div>
    </div>

    <!-- Infinite Scroll Slider -->
    <div 
      class="flex space-x-6 w-max" 
      id="testimonials-slider" 
      ref="sliderRef"
      @mouseenter="pauseSlider"
      @mouseleave="resumeSlider"
    >
      <!-- Original Cards -->
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Anak saya dapat A dalam Matematik lepas guna Mantap.work! Tutors sangat membantu."</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Puan Siti</p>
            <p class="text-xs text-gray-500">Ibu kepada pelajar SPM</p>
          </div>
        </div>
      </div>
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Platform terbaik untuk cari bahan rujukan STPM. Sangat lengkap dan mudah."</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Jason Lim</p>
            <p class="text-xs text-gray-500">Pelajar Kolej</p>
          </div>
        </div>
      </div>
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Sebagai tutor, saya dapat ramai pelajar baharu dari sini. Sistem yang sangat efisien."</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Cikgu Hawa</p>
            <p class="text-xs text-gray-500">Tutor Fizik</p>
          </div>
        </div>
      </div>
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Latihan kuiz sangat membantu untuk ulangkaji minit terakhir. Terima kasih!"</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Ali Zafar</p>
            <p class="text-xs text-gray-500">Pelajar PT3</p>
          </div>
        </div>
      </div>

      <!-- Duplicated Cards for Loop -->
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Anak saya dapat A dalam Matematik lepas guna Mantap.work! Tutors sangat membantu."</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Puan Siti</p>
            <p class="text-xs text-gray-500">Ibu kepada pelajar SPM</p>
          </div>
        </div>
      </div>
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Platform terbaik untuk cari bahan rujukan STPM. Sangat lengkap dan mudah."</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Jason Lim</p>
            <p class="text-xs text-gray-500">Pelajar Kolej</p>
          </div>
        </div>
      </div>
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Sebagai tutor, saya dapat ramai pelajar baharu dari sini. Sistem yang sangat efisien."</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Cikgu Hawa</p>
            <p class="text-xs text-gray-500">Tutor Fizik</p>
          </div>
        </div>
      </div>
      <div class="w-80 p-6 bg-white rounded-2xl shadow-md flex-shrink-0">
        <p class="jakarta text-gray-600 mb-4">"Latihan kuiz sangat membantu untuk ulangkaji minit terakhir. Terima kasih!"</p>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-bold text-sm">Ali Zafar</p>
            <p class="text-xs text-gray-500">Pelajar PT3</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
