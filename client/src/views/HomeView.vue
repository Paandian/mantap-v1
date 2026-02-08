<script setup>
import { onMounted } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

import NavBar from '../components/layout/NavBar.vue'
import HeroSection from '../components/landing/HeroSection.vue'
import TutorNetwork from '../components/landing/TutorNetwork.vue'
import NewMentors from '../components/landing/NewMentors.vue'
import SchoolsDirectory from '../components/landing/SchoolsDirectory.vue'
import MerchantsDirectory from '../components/landing/MerchantsDirectory.vue'
import AuthorizedPublishers from '../components/landing/AuthorizedPublishers.vue'
import FreeTools from '../components/landing/FreeTools.vue'
import Testimonials from '../components/landing/Testimonials.vue'
import Footer from '../components/layout/Footer.vue'

onMounted(() => {
  // Global Fade In Animations
  const fadeElements = document.querySelectorAll('.fade-in')
  
  fadeElements.forEach((element, index) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: (index % 3) * 0.1 // Stagger effect
      }
    )
  })
})
</script>

<template>
  <div class="overflow-x-hidden">
    <NavBar />
    <main>
      <HeroSection />
      <TutorNetwork />
      <NewMentors />
      <SchoolsDirectory />
      <MerchantsDirectory />
      <AuthorizedPublishers />
      <FreeTools />
      <Testimonials />
    </main>
    <Footer />
  </div>
</template>
