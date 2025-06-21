<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <div class="animate-spin rounded-full border-2 border-current border-t-transparent">
        <div class="sr-only">{{ message }}</div>
      </div>
    </div>
    <p v-if="showMessage" :class="messageClass">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  message: {
    type: String,
    default: 'Cargando...'
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: true
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  gray: 'text-gray-500',
  white: 'text-white'
}

const containerClass = computed(() => {
  const classes = []
  
  if (props.center) {
    classes.push('flex flex-col items-center justify-center')
  }
  
  if (props.overlay) {
    classes.push('fixed inset-0 bg-white bg-opacity-75 z-50')
  }
  
  return classes.join(' ')
})

const spinnerClass = computed(() => {
  return [
    sizeClasses[props.size],
    colorClasses[props.color]
  ].join(' ')
})

const messageClass = computed(() => {
  const classes = ['mt-2 text-sm']
  
  if (props.color === 'white') {
    classes.push('text-white')
  } else {
    classes.push('text-gray-600')
  }
  
  return classes.join(' ')
})
</script>
