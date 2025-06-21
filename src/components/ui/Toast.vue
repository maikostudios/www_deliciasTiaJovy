<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2" style="top: clamp(1rem, 3vw, 1.5rem); right: clamp(1rem, 3vw, 1.5rem);">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="getToastClasses(toast)"
          class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="getIcon(toast.type)" :class="getIconClasses(toast.type)" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
                <p v-if="toast.message" class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Progress bar -->
          <div v-if="toast.duration" class="h-1 bg-gray-200">
            <div
              :class="getProgressClasses(toast.type)"
              class="h-full transition-all ease-linear"
              :style="{ width: `${toast.progress}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Toast store
const toasts = ref([])
let toastId = 0

// Toast types configuration
const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    iconClass: 'text-green-400',
    progressClass: 'bg-green-500'
  },
  error: {
    icon: XCircleIcon,
    iconClass: 'text-red-400',
    progressClass: 'bg-red-500'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconClass: 'text-yellow-400',
    progressClass: 'bg-yellow-500'
  },
  info: {
    icon: InformationCircleIcon,
    iconClass: 'text-blue-400',
    progressClass: 'bg-blue-500'
  }
}

// Methods
const addToast = (toast) => {
  const id = ++toastId
  const newToast = {
    id,
    type: toast.type || 'info',
    title: toast.title,
    message: toast.message,
    duration: toast.duration !== undefined ? toast.duration : 5000,
    progress: 100
  }
  
  toasts.value.push(newToast)
  
  // Auto remove after duration
  if (newToast.duration > 0) {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.max(0, 100 - (elapsed / newToast.duration) * 100)
      
      newToast.progress = progress
      
      if (progress <= 0) {
        clearInterval(interval)
        removeToast(id)
      }
    }, 50)
  }
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAllToasts = () => {
  toasts.value = []
}

const getToastClasses = (toast) => {
  return []
}

const getIcon = (type) => {
  return toastConfig[type]?.icon || InformationCircleIcon
}

const getIconClasses = (type) => {
  return `h-6 w-6 ${toastConfig[type]?.iconClass || 'text-blue-400'}`
}

const getProgressClasses = (type) => {
  return toastConfig[type]?.progressClass || 'bg-blue-500'
}

// Global toast methods
const showSuccess = (title, message, duration) => {
  return addToast({ type: 'success', title, message, duration })
}

const showError = (title, message, duration) => {
  return addToast({ type: 'error', title, message, duration })
}

const showWarning = (title, message, duration) => {
  return addToast({ type: 'warning', title, message, duration })
}

const showInfo = (title, message, duration) => {
  return addToast({ type: 'info', title, message, duration })
}

// Expose methods globally
if (typeof window !== 'undefined') {
  window.$toast = {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    clear: clearAllToasts
  }
}

// Provide methods to parent components
defineExpose({
  addToast,
  removeToast,
  clearAllToasts,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>
