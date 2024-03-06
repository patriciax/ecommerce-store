import { ref } from 'vue'

const notifications = ref([])

export default function useNotificationsStore() {
  function pushNotification(notification) {
    notification.id = new Date().getTime()
    notifications.value.push(notification)
    setTimeout(() => removeNotification(notification.id), 5000)
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    notifications,
    pushNotification,
    removeNotification,
  }
}
