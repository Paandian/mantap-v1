<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { roleDashboards } from "@/router";

const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const isMobileMenuOpen = ref(false);
const isDarkMode = ref(
  localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),
);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const userRole = computed(() => authStore.userRole);

// Check if user can access admin dashboard
const canAccessAdmin = computed(() => {
  return ['super-admin', 'admin', 'creator'].includes(userRole.value);
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const switchLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem("user-locale", lang);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

const handleLogout = async () => {
  await authStore.logout();
  notificationStore.success('Logged out successfully');
  router.push('/');
  closeMobileMenu();
};

const goToDashboard = () => {
  const dashboardPath = roleDashboards[userRole.value] || '/dashboard';
  router.push(dashboardPath);
  closeMobileMenu();
};

const getAvatarUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // Remove '/api' from the base URL to get the server root
  const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
  const serverUrl = baseUrl.replace('/api', '')
  return `${serverUrl}${url}`
};

// Initialize theme on mount
if (isDarkMode.value) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-[60] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm h-16 transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div class="flex justify-between items-center h-full">
        <div class="flex items-center">
          <router-link to="/">
            <img
              :src="isDarkMode ? '/assets/logo-footer.svg' : '/assets/logo.svg'"
              alt="Mantap.work Logo"
              class="h-10 w-auto"
            />
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a
            href="#tutors"
            class="jakarta text-gray-700 dark:text-gray-300 hover:text-heritageTeal transition-colors duration-200"
            >{{ t("nav.tutors") }}</a
          >
          <a
            href="#mentors"
            class="jakarta text-gray-700 dark:text-gray-300 hover:text-heritageTeal transition-colors duration-200"
            >{{ t("nav.mentors") }}</a
          >
          <a
            href="#schools"
            class="jakarta text-gray-700 dark:text-gray-300 hover:text-heritageTeal transition-colors duration-200"
            >{{ t("nav.schools") }}</a
          >
          <a
            href="#merchants"
            class="jakarta text-gray-700 dark:text-gray-300 hover:text-heritageTeal transition-colors duration-200"
            >{{ t("nav.merchants") }}</a
          >
          <a
            href="#tools"
            class="jakarta text-gray-700 dark:text-gray-300 hover:text-heritageTeal transition-colors duration-200"
            >{{ t("nav.tools") }}</a
          >

          <!-- Dark Mode & Language Toggles -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-heritageTeal transition-all duration-200"
              :title="
                isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              "
            >
              <svg
                v-if="isDarkMode"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <!-- Language Toggle -->
            <div
              class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1"
            >
              <button
                @click="switchLanguage('bm')"
                class="px-3 py-1 text-xs font-bold rounded-full transition-all duration-200"
                :class="
                  locale === 'bm'
                    ? 'bg-white dark:bg-gray-700 text-heritageTeal shadow-sm'
                    : 'text-gray-500 hover:text-heritageTeal'
                "
              >
                BM
              </button>
              <button
                @click="switchLanguage('en')"
                class="px-3 py-1 text-xs font-bold rounded-full transition-all duration-200"
                :class="
                  locale === 'en'
                    ? 'bg-white dark:bg-gray-700 text-heritageTeal shadow-sm'
                    : 'text-gray-500 hover:text-heritageTeal'
                "
              >
                ENG
              </button>
            </div>
          </div>

          <!-- Auth Buttons -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-3">
            <router-link
              to="/login"
              class="jakarta bg-mantapOrange text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-200 btn-ripple"
            >
              {{ t("nav.login") }}
            </router-link>
          </div>

          <div v-else class="flex items-center space-x-3">
            <!-- User Menu -->
            <div class="relative group">
              <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="user?.avatar_url" 
                    :src="getAvatarUrl(user.avatar_url)" 
                    :alt="user?.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-indigo-600 font-semibold text-sm">
                    {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                  {{ user?.name }}
                </span>
              </button>
              
              <!-- Dropdown -->
              <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
                </div>
                <router-link
                  to="/profile"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Profile Settings
                </router-link>
                <button
                  @click="goToDashboard"
                  class="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="flex md:hidden hamburger z-[70]"
          :class="{ active: isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Container (Separated) -->
    <div
      class="fixed inset-0 z-[55] md:hidden transition-transform duration-300 ease-in-out"
      :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Menu Panel -->
      <div
        class="absolute right-0 top-0 w-full bg-white dark:bg-gray-900 shadow-xl flex flex-col pt-20 px-6 h-screen overflow-y-auto transition-colors duration-300"
      >
        <!-- Mobile Toggles -->
        <div class="flex flex-col items-center space-y-4 mb-8">
          <!-- Theme Toggle -->
          <button
            @click="toggleDarkMode"
            class="flex items-center space-x-3 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-full justify-center transition-all duration-200"
          >
            <component :is="isDarkMode ? 'svg' : 'svg'" class="h-5 w-5">
              <path
                v-if="isDarkMode"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                stroke="currentColor"
                fill="none"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                stroke="currentColor"
                fill="none"
              />
            </component>
            <span class="jakarta font-bold text-sm">{{
              isDarkMode ? "Light Mode" : "Dark Mode"
            }}</span>
          </button>

          <!-- Language Toggle -->
          <div
            class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 w-fit"
          >
            <button
              @click="switchLanguage('bm')"
              class="px-4 py-2 text-sm font-bold rounded-full transition-all duration-200"
              :class="
                locale === 'bm'
                  ? 'bg-white dark:bg-gray-700 text-heritageTeal shadow-sm'
                  : 'text-gray-500'
              "
            >
              BM
            </button>
            <button
              @click="switchLanguage('en')"
              class="px-4 py-2 text-sm font-bold rounded-full transition-all duration-200"
              :class="
                locale === 'en'
                  ? 'bg-white dark:bg-gray-700 text-heritageTeal shadow-sm'
                  : 'text-gray-500'
              "
            >
              ENG
            </button>
          </div>
        </div>

        <a
          href="#tutors"
          @click="closeMobileMenu"
          class="jakarta text-gray-800 dark:text-gray-200 font-semibold hover:text-heritageTeal transition-colors duration-200 py-3 border-b border-gray-100 dark:border-gray-800 text-lg"
          >{{ t("nav.tutors") }}</a
        >
        <a
          href="#mentors"
          @click="closeMobileMenu"
          class="jakarta text-gray-800 dark:text-gray-200 font-semibold hover:text-heritageTeal transition-colors duration-200 py-3 border-b border-gray-100 dark:border-gray-800 text-lg"
          >{{ t("nav.mentors") }}</a
        >
        <a
          href="#schools"
          @click="closeMobileMenu"
          class="jakarta text-gray-800 dark:text-gray-200 font-semibold hover:text-heritageTeal transition-colors duration-200 py-3 border-b border-gray-100 dark:border-gray-800 text-lg"
          >{{ t("nav.schools") }}</a
        >
        <a
          href="#merchants"
          @click="closeMobileMenu"
          class="jakarta text-gray-800 dark:text-gray-200 font-semibold hover:text-heritageTeal transition-colors duration-200 py-3 border-b border-gray-100 dark:border-gray-800 text-lg"
          >{{ t("nav.merchants") }}</a
        >
        <a
          href="#tools"
          @click="closeMobileMenu"
          class="jakarta text-gray-800 dark:text-gray-200 font-semibold hover:text-heritageTeal transition-colors duration-200 py-3 border-b border-gray-100 dark:border-gray-800 text-lg"
          >{{ t("nav.tools") }}</a
        >
        
        <!-- Mobile Auth Buttons -->
        <div class="pt-8 space-y-3">
          <template v-if="!isAuthenticated">
            <router-link
              to="/login"
              @click="closeMobileMenu"
              class="block text-center jakarta bg-mantapOrange text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors duration-200 shadow-md"
            >
              {{ t("nav.login") }}
            </router-link>
          </template>
          
          <template v-else>
            <div class="text-center pb-4 border-b border-gray-200 dark:border-gray-800">
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ user?.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
            </div>
            
            <router-link
              to="/profile"
              @click="closeMobileMenu"
              class="block w-full text-center jakarta bg-teal-600 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
            >
              Profile Settings
            </router-link>
            
            <button
              @click="goToDashboard"
              class="block w-full text-center jakarta bg-indigo-600 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              Dashboard
            </button>
            
            <button
              @click="handleLogout"
              class="block w-full text-center jakarta bg-red-600 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
            >
              Logout
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
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
  transition:
    width 0.6s,
    height 0.6s;
}

.btn-ripple:hover::after {
  width: 300px;
  height: 300px;
}

/* Hamburger Animation */
.hamburger {
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  width: 30px;
  height: 3px;
  background: #0d9488;
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg);
}
</style>
