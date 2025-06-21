<template>
  <div class="card p-4 group">
    <!-- Product Image -->
    <div class="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
      <div class="aspect-square w-full">
        <img
          v-if="productImageUrl && !imageError"
          :src="productImageUrl"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImageError"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary/10 to-secondary/10"
        >
          {{ getCategoryEmoji(product.category) }}
        </div>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-2 left-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
          {{ getCategoryEmoji(product.category) }} {{ getCategoryName(product.category) }}
        </span>
      </div>
      
      <!-- Offer Badge -->
      <div v-if="product.originalPrice" class="absolute top-2 right-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
          🏷️ Oferta
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-900 text-lg leading-tight">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm line-clamp-2">{{ product.description }}</p>
      
      <!-- Price -->
      <div class="flex items-center space-x-2">
        <span class="text-xl font-bold text-primary">{{ formatPrice(product.price) }}</span>
        <span
          v-if="product.originalPrice"
          class="text-sm text-gray-500 line-through"
        >
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>
      
      <!-- Discount Percentage -->
      <div v-if="product.originalPrice" class="text-sm text-green-600 font-medium">
        ¡Ahorra {{ discountPercentage }}%!
      </div>
    </div>

    <!-- Add to Cart Button -->
    <button
      v-if="!preview"
      @click="handleAddToCart"
      class="w-full mt-4 btn-primary group-hover:shadow-lg"
      :class="{ 'animate-pulse': isAdding }"
    >
      <span v-if="!isAdding" class="flex items-center justify-center space-x-2">
        <ShoppingCartIcon class="h-5 w-5" />
        <span>Agregar al Carrito</span>
      </span>
      <span v-else>Agregando...</span>
    </button>

    <!-- Preview Badge -->
    <div v-if="preview" class="w-full mt-4 bg-blue-100 text-blue-800 text-center py-3 rounded-lg font-medium">
      👁️ Vista Previa del Producto
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  preview: {
    type: Boolean,
    default: false
  }
})

const cartStore = useCartStore()
const productsStore = useProductsStore()
const isAdding = ref(false)
const imageError = ref(false)

const formatPrice = (price) => productsStore.formatPrice(price)

// Computed para obtener la URL de imagen correcta
const productImageUrl = computed(() => {
  return productsStore.getProductImageUrl(props.product, 'medium')
})

const discountPercentage = computed(() => {
  if (!props.product.originalPrice) return 0
  return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100)
})

const getCategoryEmoji = (category) => {
  const emojis = {
    'tortas': '🎂',
    'panaderia': '🥖',
    'sin-azucar': '🌿',
    'ofertas': '🏷️'
  }
  return emojis[category] || '🧁'
}

const getCategoryName = (category) => {
  const names = {
    'tortas': 'Tortas',
    'panaderia': 'Panadería',
    'sin-azucar': 'Sin Azúcar',
    'ofertas': 'Ofertas'
  }
  return names[category] || 'Producto'
}

const handleImageError = (event) => {
  console.warn('⚠️ Error al cargar imagen del producto:', props.product.name, props.product.imageUrl)
  imageError.value = true
  event.target.style.display = 'none'
}

const handleAddToCart = async () => {
  isAdding.value = true
  
  // Add a small delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300))
  
  cartStore.addItem(props.product)
  isAdding.value = false
  
  // Optional: Show a brief success animation or toast
  // You could emit an event here for parent components to handle
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
