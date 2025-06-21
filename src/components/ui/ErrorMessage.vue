<template>
  <div :class="containerClass">
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <component :is="iconComponent" :class="iconClass" />
      </div>
      
      <!-- Content -->
      <div class="ml-3 flex-1">
        <h3 v-if="title" :class="titleClass">{{ title }}</h3>
        <div :class="messageClass">
          <p v-if="typeof message === 'string'">{{ message }}</p>
          <div v-else v-html="message"></div>
        </div>
        
        <!-- Actions -->
        <div v-if="showRetry || $slots.actions" class="mt-4 flex space-x-3">
          <button
            v-if="showRetry"
            @click="$emit('retry')"
            :disabled="retrying"
            class="btn-sm btn-outline"
          >
            <ArrowPathIcon v-if="!retrying" class="h-4 w-4 mr-1" />
            <div v-else class="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            {{ retrying ? 'Reintentando...' : 'Reintentar' }}
          </button>
          
          <slot name="actions"></slot>
        </div>
      </div>
      
      <!-- Close button -->
      <div v-if="dismissible" class="ml-auto pl-3">
        <button
          @click="$emit('dismiss')"
          class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: [String, Object],
    required: true
  },
  showRetry: {
    type: Boolean,
    default: false
  },
  retrying: {
    type: Boolean,
    default: false
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['retry', 'dismiss'])

const typeConfig = {
  error: {
    icon: XCircleIcon,
    containerClass: 'bg-red-50 border border-red-200 text-red-800',
    iconClass: 'text-red-400',
    titleClass: 'text-red-800 font-medium',
    messageClass: 'text-red-700'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    containerClass: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    iconClass: 'text-yellow-400',
    titleClass: 'text-yellow-800 font-medium',
    messageClass: 'text-yellow-700'
  },
  info: {
    icon: InformationCircleIcon,
    containerClass: 'bg-blue-50 border border-blue-200 text-blue-800',
    iconClass: 'text-blue-400',
    titleClass: 'text-blue-800 font-medium',
    messageClass: 'text-blue-700'
  },
  success: {
    icon: CheckCircleIcon,
    containerClass: 'bg-green-50 border border-green-200 text-green-800',
    iconClass: 'text-green-400',
    titleClass: 'text-green-800 font-medium',
    messageClass: 'text-green-700'
  }
}

const sizeClasses = {
  sm: 'p-3 text-sm',
  md: 'p-4',
  lg: 'p-6 text-lg'
}

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}

const config = computed(() => typeConfig[props.type])

const containerClass = computed(() => {
  return [
    'rounded-lg',
    sizeClasses[props.size],
    config.value.containerClass
  ].join(' ')
})

const iconComponent = computed(() => config.value.icon)

const iconClass = computed(() => {
  return [
    iconSizes[props.size],
    config.value.iconClass
  ].join(' ')
})

const titleClass = computed(() => {
  const classes = [config.value.titleClass]
  
  if (props.size === 'sm') {
    classes.push('text-sm')
  } else if (props.size === 'lg') {
    classes.push('text-lg')
  }
  
  return classes.join(' ')
})

const messageClass = computed(() => {
  const classes = [config.value.messageClass]
  
  if (props.title) {
    classes.push('mt-1')
  }
  
  if (props.size === 'sm') {
    classes.push('text-xs')
  } else if (props.size === 'lg') {
    classes.push('text-base')
  } else {
    classes.push('text-sm')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.btn-sm {
  @apply px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
  min-height: 2rem;
}

.btn-outline {
  @apply border border-current text-current hover:bg-current hover:text-white;
}
</style>
