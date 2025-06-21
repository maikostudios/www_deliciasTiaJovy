<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2 translate-x-1/2"
      enter-to-class="opacity-100 translate-y-0 translate-x-1/2"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 translate-x-1/2"
      leave-to-class="opacity-0 translate-y-2 translate-x-1/2"
    >
      <div
        v-if="visible"
        class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4"
      >
        <div
          :class="[
            'rounded-lg shadow-lg p-4 flex items-center space-x-3',
            typeClasses
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="type === 'success'" class="h-6 w-6" />
            <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-6 w-6" />
            <XCircleIcon v-else-if="type === 'error'" class="h-6 w-6" />
            <InformationCircleIcon v-else class="h-6 w-6" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{{ title }}</p>
            <p v-if="message" class="text-sm opacity-90">{{ message }}</p>
          </div>

          <!-- Action Button (optional) -->
          <button
            v-if="actionText"
            @click="handleAction"
            class="text-sm font-medium underline hover:no-underline"
          >
            {{ actionText }}
          </button>

          <!-- Close Button -->
          <button
            @click="close"
            class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  },
  actionText: {
    type: String,
    default: ''
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'action'])

const visible = ref(false)

const typeClasses = computed(() => {
  const classes = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200'
  }
  return classes[props.type]
})

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 200)
}

const handleAction = () => {
  emit('action')
  close()
}

onMounted(() => {
  visible.value = true
  
  if (!props.persistent && props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>
