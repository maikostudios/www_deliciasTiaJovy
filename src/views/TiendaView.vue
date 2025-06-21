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
    <div class="fixed bottom-8 right-4 z-40 md:hidden">
      <button
        @click="cartStore.toggleDrawer()"
        class="w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative group"
        :class="{ 'animate-bounce': cartStore.itemCount > 0 && !cartStore.isDrawerOpen }"
      >
        <ShoppingCartIcon class="h-7 w-7 group-hover:scale-110 transition-transform" />
        <span
          v-if="cartStore.itemCount > 0"
          class="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full h-7 w-7 flex items-center justify-center font-bold animate-pulse"
        >
          {{ cartStore.itemCount }}
        </span>

        <!-- Ripple effect on tap -->
        <div class="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
      </button>

      <!-- Cart total preview (when items > 0) -->
      <div
        v-if="cartStore.itemCount > 0 && !cartStore.isDrawerOpen"
        class="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-90"
      >
        {{ cartStore.formattedTotal }}
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/products/ProductGrid.vue'
import PromoBanner from '@/components/layout/PromoBanner.vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const productsStore = useProductsStore()
const loading = ref(false)

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
})
</script>
