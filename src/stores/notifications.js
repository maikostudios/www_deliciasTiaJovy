import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])

  function addNotification(notification) {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'success',
      duration: 3000,
      persistent: false,
      ...notification
    }
    
    notifications.value.push(newNotification)
    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  // Convenience methods
  function success(title, message = '', options = {}) {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  function error(title, message = '', options = {}) {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 5000, // Longer duration for errors
      ...options
    })
  }

  function warning(title, message = '', options = {}) {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  function info(title, message = '', options = {}) {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  // Cart-specific notifications
  function productAdded(productName, options = {}) {
    return success(
      '✅ Producto agregado',
      `${productName} se agregó al carrito`,
      {
        actionText: 'Ver Carrito',
        ...options
      }
    )
  }

  function productRemoved(productName) {
    return info(
      '🗑️ Producto eliminado',
      `${productName} se eliminó del carrito`
    )
  }

  function cartCleared() {
    return info(
      '🛒 Carrito vaciado',
      'Todos los productos fueron eliminados'
    )
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    productAdded,
    productRemoved,
    cartCleared
  }
})
