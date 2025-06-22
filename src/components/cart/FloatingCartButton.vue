<template>
  <!-- Floating Cart Button & Notification -->
  <teleport to="body">
    <!-- Floating Cart Button -->
    <div ref="floatingButton" class="fixed right-6 z-[9999] transition-all duration-300" :class="buttonPosition">
      <button @click="cartStore.toggleModal()"
        class="w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative"
        :aria-label="`Abrir carrito con ${cartStore.itemCount} productos`"
        :title="`Carrito (${cartStore.itemCount} productos)`">
        <ShoppingCartIcon class="h-6 w-6" aria-hidden="true" />
        <span v-if="cartStore.itemCount > 0"
          class="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold"
          :aria-label="`${cartStore.itemCount} productos en el carrito`">
          {{ cartStore.itemCount }}
        </span>
      </button>
    </div>

    <!-- Add to Cart Notification -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0">
      <div v-if="cartStore.showNotification" 
        class="fixed right-4 sm:right-24 z-[9999] transition-all duration-300"
        :class="notificationPosition">
        <div class="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-xs sm:max-w-sm">
          <span class="text-lg">🛒</span>
          <div class="flex-1">
            <p class="text-sm font-medium">¡Producto Agregado!</p>
            <p class="text-xs opacity-90 truncate">{{ cartStore.lastAddedProduct }}</p>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()

// Floating button logic
const floatingButton = ref(null)
const isNearFooter = ref(false)

// Computed property for button position
const buttonPosition = computed(() => {
  return isNearFooter.value ? 'bottom-32' : 'bottom-6'
})

// Computed property for notification position
const notificationPosition = computed(() => {
  return isNearFooter.value ? 'bottom-32' : 'bottom-6'
})

// Function to check if user is near footer
const checkFooterPosition = () => {
  const footer = document.querySelector('footer')
  if (!footer) return

  const footerRect = footer.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  // If footer is visible (top of footer is within viewport + 50px buffer)
  isNearFooter.value = footerRect.top <= windowHeight + 50
}

// Throttle function for performance
const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

const throttledCheckFooter = throttle(checkFooterPosition, 100)

onMounted(() => {
  // Setup scroll listener for footer detection
  window.addEventListener('scroll', throttledCheckFooter)
  window.addEventListener('resize', throttledCheckFooter)
  
  // Initial check
  checkFooterPosition()
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledCheckFooter)
  window.removeEventListener('resize', throttledCheckFooter)
})
</script>
