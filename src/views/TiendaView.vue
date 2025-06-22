<template>
  <div class="min-h-screen">
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

    <!-- Floating Cart Button & Notification -->
    <FloatingCartButton />

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
import { useProductsStore } from '@/stores/products'
import ProductGrid from '@/components/products/ProductGrid.vue'
import PromoBanner from '@/components/layout/PromoBanner.vue'
import FloatingCartButton from '@/components/cart/FloatingCartButton.vue'

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
