<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || 'ℹ'
}

const getStyles = (type) => {
  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return styles[type] || styles.info
}

const closeNotification = (id) => {
  notificationStore.removeNotification(id)
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] space-y-2">
    <transition-group name="notification">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md',
          getStyles(notification.type)
        ]"
      >
        <span class="text-xl font-bold">{{ getIcon(notification.type) }}</span>
        <p class="flex-1 text-sm font-medium">{{ notification.message }}</p>
        <button
          @click="closeNotification(notification.id)"
          class="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
