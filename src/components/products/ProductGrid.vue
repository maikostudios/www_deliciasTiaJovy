<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <!-- Category Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="category in productsStore.categories"
          :key="category.id"
          @click="productsStore.setCategory(category.id)"
          :class="[
            'inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            productsStore.selectedCategory === category.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          ]"
        >
          <span>{{ category.icon }}</span>
          <span>{{ category.name }}</span>
        </button>
      </div>

      <!-- Search -->
      <div class="relative w-full sm:w-auto sm:min-w-[300px]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="productsStore.searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
        <button
          v-if="productsStore.searchQuery"
          @click="productsStore.setSearchQuery('')"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <XMarkIcon class="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Results Info -->
    <div class="flex items-center justify-between">
      <p class="text-gray-600">
        {{ filteredProducts.length }} producto{{ filteredProducts.length !== 1 ? 's' : '' }}
        <span v-if="productsStore.selectedCategory !== 'todas' || productsStore.searchQuery">
          encontrado{{ filteredProducts.length !== 1 ? 's' : '' }}
        </span>
      </p>
      
      <button
        v-if="productsStore.selectedCategory !== 'todas' || productsStore.searchQuery"
        @click="productsStore.clearFilters()"
        class="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
      >
        Limpiar filtros
      </button>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
      <p class="text-gray-500 mb-4">
        Intenta con otros términos de búsqueda o cambia los filtros.
      </p>
      <button
        @click="productsStore.clearFilters()"
        class="btn-primary"
      >
        Ver Todos los Productos
      </button>
    </div>

    <!-- Loading State (if needed) -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="n in 8"
        :key="n"
        class="card p-4 animate-pulse"
      >
        <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div class="h-10 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from './ProductCard.vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const productsStore = useProductsStore()

const filteredProducts = computed(() => productsStore.filteredProducts)
</script>
