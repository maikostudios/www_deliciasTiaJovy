<template>
  <div class="fixed top-0 left-0 w-full z-50 pointer-events-none">
    <div class="flex flex-col items-center space-y-2 p-4">
      <ToastNotification
        v-for="notification in notificationsStore.notifications"
        :key="notification.id"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        :duration="notification.duration"
        :action-text="notification.actionText"
        :persistent="notification.persistent"
        class="pointer-events-auto"
        @close="notificationsStore.removeNotification(notification.id)"
        @action="handleNotificationAction(notification)"
      />
    </div>
  </div>
</template>

<script setup>
import { useNotificationsStore } from '@/stores/notifications'
import { useCartStore } from '@/stores/cart'
import ToastNotification from './ToastNotification.vue'

const notificationsStore = useNotificationsStore()
const cartStore = useCartStore()

const handleNotificationAction = (notification) => {
  // Handle different notification actions
  if (notification.actionText === 'Ver Carrito') {
    cartStore.openDrawer()
  }
  
  // Emit custom action if provided
  if (notification.onAction) {
    notification.onAction()
  }
}
</script>
