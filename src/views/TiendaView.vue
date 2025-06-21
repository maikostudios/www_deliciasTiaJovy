<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b border-gray-200">
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
    <div class="fixed bottom-6 right-6 z-40 md:hidden">
      <button
        @click="cartStore.toggleDrawer()"
        class="w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative"
      >
        <ShoppingCartIcon class="h-6 w-6" />
        <span
          v-if="cartStore.itemCount > 0"
          class="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold"
        >
          {{ cartStore.itemCount }}
        </span>
      </button>
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
