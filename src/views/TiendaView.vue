<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section class="bg-transparent-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
            Nuestra Tienda
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora todos nuestros productos caseros. Desde tortas personalizadas hasta pan fresco del día.
          </p>
        </div>
      </div>
    </section>

    <!-- Promotional Banner -->
    <PromoBanner />

    <!-- Main Content -->
    <section class="py-8 lg:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="productos-grid">
          <ProductGrid :loading="loading" />
        </div>
      </div>
    </section>

    <!-- Floating Cart Button (Mobile) -->
    <teleport to="body">
      <div ref="floatingButton" class="fixed right-6 z-[9999] md:hidden transition-all duration-300"
        :class="buttonPosition">
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
    </teleport>

    <!-- Info Banner -->
    <section class="bg-primary text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="space-y-2">
            <div class="text-3xl">🚚</div>
            <h3 class="font-semibold">Entrega a Domicilio</h3>
            <p class="text-white/90 text-sm">En Nueva Imperial y alrededores</p>
          </div>
          <div class="space-y-2">
            <div class="text-3xl">⏰</div>
            <h3 class="font-semibold">Productos Frescos</h3>
            <p class="text-white/90 text-sm">Elaborados diariamente</p>
          </div>
          <div class="space-y-2">
            <div class="text-3xl">📱</div>
            <h3 class="font-semibold">Pedidos por WhatsApp</h3>
            <p class="text-white/90 text-sm">Rápido y fácil</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/products/ProductGrid.vue'
import PromoBanner from '@/components/layout/PromoBanner.vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const productsStore = useProductsStore()
const loading = ref(false)
const floatingButton = ref(null)
const isNearFooter = ref(false)

// Computed property for button position
const buttonPosition = computed(() => {
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

onMounted(async () => {
  // Load products from Firebase
  loading.value = true
  try {
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }

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
