<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

gsap.registerPlugin(ScrollTrigger)

const tickerContent = ref(null)
const heroSection = ref(null)
let tickerTween = null

onMounted(() => {
  // Hero Ticker Animation
  if (tickerContent.value) {
    const listHeight = tickerContent.value.scrollHeight / 2
    
    tickerTween = gsap.to(tickerContent.value, {
      y: -listHeight,
      duration: 30,
      ease: 'none',
      repeat: -1,
      modifiers: {
        y: gsap.utils.unitize((y) => parseFloat(y) % listHeight)
      }
    })
  }

  // Parallax Effect
  if (heroSection.value) {
    gsap.to(heroSection.value, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
  }
})

onUnmounted(() => {
  if (tickerTween) tickerTween.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<template>
  <section 
    ref="heroSection"
    class="relative min-h-screen flex items-center parallax-bg pt-16" 
    style="background-image: linear-gradient(rgba(13, 148, 136, 0.7), rgba(249, 115, 22, 0.6)), url('/assets/hero-image.png');"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-8 items-center">
        <!-- Left: Text & CTA -->
        <div class="text-white space-y-6 lg:col-span-7">
          <h1 class="handwritten text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
            {{ t('hero.headline') }}
          </h1>
          <p class="jakarta text-lg sm:text-xl text-white/90 dark:text-gray-100 max-w-xl drop-shadow-md">
             {{ t('hero.subheadline') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button class="jakarta bg-mantapOrange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all duration-200 btn-ripple shadow-lg">
               {{ t('hero.cta_primary') }}
            </button>
            <button class="jakarta bg-white text-heritageTeal px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg">
              {{ t('hero.cta_secondary_alt') }}
            </button>
          </div>
        </div>
        
        <!-- Right Ticker -->
        <div class="w-full flex justify-center md:justify-end lg:col-span-3 h-full">
          <div class="sticky-note p-6 w-full h-96 overflow-hidden relative shadow-xl dark:bg-gray-800 transition-colors duration-300" style="--sticky-color: #fef9c3">
            <h3 class="text-lg font-bold mb-4 text-center text-darkGray dark:text-gray-100">{{ t('hero.ticker_title') || 'Latest Updates' }}</h3>
            <div class="ticker-container h-full overflow-hidden relative">
              <div ref="tickerContent" class="ticker-content absolute top-0 left-0 right-0 dark:text-gray-300">
                <ul class="space-y-3 text-sm">
                  <!-- Original List -->
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>New mentors joined: 15 fresh graduates with cutting-edge skills</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Verified tutor network expanded to 500+ professionals</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>New school partnerships in Johor and Penang</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Free tools now include AI-powered lesson planning</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>Merchants directory updated with latest educational products</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Community forum launched for educators and parents</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>Authorized publishers section expanded with new titles</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Testimonials from 1000+ satisfied users</span>
                  </li>
                  
                  <!-- Duplicate for infinite loop -->
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>New mentors joined: 15 fresh graduates with cutting-edge skills</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Verified tutor network expanded to 500+ professionals</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>New school partnerships in Johor and Penang</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Free tools now include AI-powered lesson planning</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>Merchants directory updated with latest educational products</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Community forum launched for educators and parents</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-mantapOrange mr-2">•</span>
                    <span>Authorized publishers section expanded with new titles</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-heritageTeal mr-2">•</span>
                    <span>Testimonials from 1000+ satisfied users</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.parallax-bg {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

@media (prefers-reduced-motion: reduce) {
  .parallax-bg {
    background-attachment: scroll;
  }
}

.sticky-note {
  background: var(--sticky-color, #fef9c3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sticky-note::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--sticky-color, #fef9c3);
}

/* Button Ripple Effect */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-ripple:hover::after {
  width: 300px;
  height: 300px;
}
</style>
