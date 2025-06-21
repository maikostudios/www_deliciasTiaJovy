<template>
  <div :class="containerClass">
    <div :class="spinnerClass" :style="spinnerStyle">
      <div class="animate-spin rounded-full border-2 border-current border-t-transparent w-full h-full">
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

// Responsive size styles
const responsiveSizeStyles = {
  xs: 'width: clamp(1rem, 3vw, 1.25rem); height: clamp(1rem, 3vw, 1.25rem);',
  sm: 'width: clamp(1.25rem, 4vw, 1.5rem); height: clamp(1.25rem, 4vw, 1.5rem);',
  md: 'width: clamp(1.5rem, 5vw, 2rem); height: clamp(1.5rem, 5vw, 2rem);',
  lg: 'width: clamp(2rem, 6vw, 3rem); height: clamp(2rem, 6vw, 3rem);',
  xl: 'width: clamp(3rem, 8vw, 4rem); height: clamp(3rem, 8vw, 4rem);'
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

const spinnerStyle = computed(() => {
  return responsiveSizeStyles[props.size] || responsiveSizeStyles.md
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
