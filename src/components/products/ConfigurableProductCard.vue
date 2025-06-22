<template>
  <div
    class="configurable-product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 group">
    <!-- Product Image -->
    <div class="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
      <div class="aspect-square w-full">
        <img v-if="productImageUrl && !imageError" :src="productImageUrl" :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImageError" />
        <div v-else
          class="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary/10 to-secondary/10">
          🎂
        </div>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-2 left-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
          🎂 Torta Configurable
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="product.featured" class="absolute top-2 right-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
          ⭐ Destacado
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="space-y-3">
      <h3 class="font-semibold text-gray-900 text-lg leading-tight">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm line-clamp-2">{{ product.description }}</p>

      <!-- Price Range -->
      <div class="flex items-center space-x-2">
        <span class="text-lg font-bold text-primary">Desde {{ formatPrice(minPrice) }}</span>
        <span class="text-sm text-gray-500">hasta {{ formatPrice(maxPrice) }}</span>
      </div>

      <!-- Available Sizes -->
      <div class="text-sm text-gray-600">
        <span class="font-medium">Tamaños:</span>
        {{ availableSizesText }}
      </div>

      <!-- Available Fillings Count -->
      <div class="text-sm text-gray-600">
        <span class="font-medium">Rellenos:</span>
        {{ availableFillings.length }} opciones disponibles
      </div>
    </div>

    <!-- Configure Button -->
    <button @click="openConfigModal"
      class="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
      <span class="flex items-center justify-center space-x-2">
        <span class="text-lg">🎨</span>
        <span>Personalizar Torta</span>
      </span>
    </button>

    <!-- Configuration Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-primary to-secondary px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">
                🎂 Personalizar {{ product.name }}
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 transition-colors">
                <span class="text-2xl">×</span>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="px-6 py-4 max-h-96 overflow-y-auto">
            <!-- Size Selection -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">📏 Selecciona el tamaño:</h4>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="size in availableSizes" :key="size.people" class="relative">
                  <input :id="`modal-size-${size.people}`" v-model="selectedSize" :value="size.people" type="radio"
                    name="size" class="sr-only" />
                  <label :for="`modal-size-${size.people}`" :class="[
                    'block p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center',
                    selectedSize === size.people
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  ]">
                    <div class="font-semibold text-gray-900">{{ size.people }} personas</div>
                    <div class="text-sm text-primary font-medium">{{ formatPrice(size.price) }}</div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Filling Selection -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">🥧 Selecciona los rellenos:</h4>
              <p class="text-sm text-gray-600 mb-3">Puedes combinar como quieras</p>

              <div class="space-y-4">
                <div v-for="category in fillingCategories" :key="category.id">
                  <h5 class="font-medium text-gray-800 mb-2 flex items-center">
                    <span class="mr-2">{{ category.icon }}</span>
                    {{ category.name }}
                  </h5>
                  <div class="grid grid-cols-1 gap-2">
                    <label v-for="filling in getFillingsByCategory(category.id)" :key="filling.id"
                      class="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      :class="{ 'border-primary bg-primary/5': selectedFilling === filling.id }">
                      <input v-model="selectedFilling" :value="filling.id" type="radio" name="cake-filling"
                        class="text-primary border-gray-300 focus:ring-primary" />
                      <span class="text-sm text-gray-700">{{ filling.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Extras Selection -->
            <div v-if="availableExtras.length > 0" class="mb-6">
              <h4 class="font-medium text-gray-900 mb-3">✨ Extras opcionales:</h4>
              <div class="space-y-2">
                <label v-for="extra in availableExtras" :key="extra.id"
                  class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div class="flex items-center space-x-3">
                    <input v-model="selectedExtras" :value="extra.id" type="checkbox"
                      class="text-primary border-gray-300 rounded focus:ring-primary" />
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ extra.name }}</div>
                      <div class="text-xs text-gray-600">{{ extra.description }}</div>
                    </div>
                  </div>
                  <div class="text-sm font-medium text-primary">
                    {{ extra.price === 'variable' ? 'Cotizar' : formatPrice(extra.price) }}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Información Importante -->
          <div class="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <div class="space-y-3">
              <!-- Extras adicionales -->
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm">💬</span>
                </div>
                <div class="text-sm text-blue-800">
                  <p class="font-medium mb-1">¿Necesitas algo más?</p>
                  <p>Si necesitas algún extra adicional que no está en el formulario, no te preocupes. Cuando realices
                    el pedido tendrás un espacio para agregar más comentarios y especificaciones.</p>
                </div>
              </div>

              <!-- Coordinación de entrega -->
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm">📅</span>
                </div>
                <div class="text-sm text-purple-800">
                  <p class="font-medium mb-1">Coordinación de entrega</p>
                  <p>La fecha de entrega del producto se coordinará directamente con la pastelera cuando completes el
                    pedido en el carrito de compras.</p>
                </div>
              </div>

              <!-- Modalidad de pago -->
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm">💰</span>
                </div>
                <div class="text-sm text-green-800">
                  <p class="font-medium mb-1">Modalidad de pago</p>
                  <p>Puedes elegir entre:</p>
                  <ul class="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Pago completo:</strong> 100% al confirmar tu pedido</li>
                    <li><strong>Abono:</strong> 50% no reembolsable al confirmar + 50% al retirar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="text-lg font-bold text-gray-900">
                Total: {{ formatPrice(totalPrice) }}
              </div>
              <div class="flex space-x-3">
                <button @click="closeModal"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button @click="addToCart" :disabled="!canAddToCart"
                  class="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  🛒 Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const productsStore = useProductsStore()

// Modal state
const showModal = ref(false)
const selectedSize = ref(null)
const selectedFilling = ref(null) // Cambiado a selección única
const selectedExtras = ref([])
const imageError = ref(false)

// Computed
const productImageUrl = computed(() => {
  return productsStore.getProductImageUrl(props.product, 'medium')
})

const availableSizes = computed(() => {
  const allSizes = productsStore.cakeConfig.sizes
  const productSizes = props.product.cakeConfig?.sizes || props.product.cakeConfig?.availableSizes || []

  // Si el producto no tiene configuración específica, usar todos los tamaños disponibles
  if (productSizes.length === 0) {
    return allSizes
  }

  return allSizes.filter(size => productSizes.includes(size.people))
})

const availableFillings = computed(() => {
  const allFillings = productsStore.cakeConfig.fillings
  const productFillings = props.product.cakeConfig?.fillings || props.product.cakeConfig?.availableFillings || []

  // Si el producto no tiene configuración específica, usar todos los rellenos disponibles
  if (productFillings.length === 0) {
    return allFillings
  }

  return allFillings.filter(filling => productFillings.includes(filling.id))
})

const availableExtras = computed(() => {
  const allExtras = productsStore.cakeConfig.extras
  const productExtras = props.product.cakeConfig?.extras || props.product.cakeConfig?.availableExtras || []

  // Si el producto no tiene configuración específica, usar todos los extras disponibles
  if (productExtras.length === 0) {
    return allExtras
  }

  return allExtras.filter(extra => productExtras.includes(extra.id))
})

const minPrice = computed(() => {
  return Math.min(...availableSizes.value.map(size => size.price))
})

const maxPrice = computed(() => {
  return Math.max(...availableSizes.value.map(size => size.price))
})

const availableSizesText = computed(() => {
  const sizes = availableSizes.value.map(size => `${size.people} pers.`)
  return sizes.join(', ')
})

const fillingCategories = computed(() => [
  { id: 'frutal', name: 'Rellenos Frutales', icon: '🍓' },
  { id: 'chocolate', name: 'Rellenos de Chocolate', icon: '🍫' }
])

const totalPrice = computed(() => {
  let total = 0

  // Base price from selected size
  if (selectedSize.value) {
    const size = availableSizes.value.find(s => s.people === selectedSize.value)
    total += size ? size.price : 0
  }

  // Add extras with fixed prices
  selectedExtras.value.forEach(extraId => {
    const extra = availableExtras.value.find(e => e.id === extraId)
    if (extra && typeof extra.price === 'number') {
      total += extra.price
    }
  })

  return total
})

const canAddToCart = computed(() => {
  return selectedSize.value && selectedFilling.value
})

// Methods
const formatPrice = (price) => productsStore.formatPrice(price)

const getFillingsByCategory = (category) => {
  return availableFillings.value.filter(filling => filling.category === category)
}

const openConfigModal = () => {
  showModal.value = true
  // Reset selections
  selectedSize.value = null
  selectedFilling.value = null
  selectedExtras.value = []
}

const closeModal = () => {
  showModal.value = false
}

const addToCart = () => {
  if (!canAddToCart.value) return

  // Create configured product for cart
  const configuredProduct = {
    ...props.product,
    id: `${props.product.id}-${Date.now()}`, // Unique ID for configured product
    name: `${props.product.name} (${selectedSize.value} personas)`,
    price: totalPrice.value,
    configuration: {
      size: selectedSize.value,
      filling: selectedFilling.value, // Cambiado a singular
      extras: selectedExtras.value
    }
  }

  cartStore.addItem(configuredProduct)
  closeModal()
}

const handleImageError = (event) => {
  console.warn('⚠️ Error al cargar imagen de torta configurable:', props.product.name, props.product.imageId)
  imageError.value = true
  event.target.style.display = 'none'
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
