import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  let nextId = 1

  const addNotification = ({ message, type = 'info', duration = 5000 }) => {
    const id = nextId++
    const notification = {
      id,
      message,
      type,
      duration
    }
    notifications.value.push(notification)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Convenience methods
  const success = (message, duration) => addNotification({ message, type: 'success', duration })
  const error = (message, duration) => addNotification({ message, type: 'error', duration })
  const warning = (message, duration) => addNotification({ message, type: 'warning', duration })
  const info = (message, duration) => addNotification({ message, type: 'info', duration })

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
})
