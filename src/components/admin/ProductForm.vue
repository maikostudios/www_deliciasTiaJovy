<template>
  <div class="product-form">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg mb-8 text-white">
      <h2 class="text-2xl font-bold mb-2 flex items-center">
        <span class="text-3xl mr-3">➕</span>
        {{ isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto' }}
      </h2>
      <p class="text-white/90">
        {{ isEditing ? 'Modifica los datos del producto' : 'Completa la información para agregar un nuevo producto al catálogo' }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Información básica -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span class="text-2xl mr-3">📝</span>
          Información Básica
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del producto *
            </label>
            <input 
              v-model="form.name"
              type="text"
              required
              placeholder="Ej: Torta de Chocolate"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Precio (solo para productos simples) -->
          <div v-if="form.productType === 'simple'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Precio (CLP) *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-500">$</span>
              <input
                v-model.number="form.price"
                type="number"
                :required="form.productType === 'simple'"
                min="0"
                step="100"
                placeholder="15000"
                class="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Precio mostrado: {{ formatPrice(form.price || 0) }}
            </p>
          </div>

          <!-- Precio base para tortas configurables -->
          <div v-if="form.productType === 'configurable'" class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">💡 Precio para Tortas Configurables</h4>
            <p class="text-sm text-blue-800">
              El precio se configurará automáticamente según los tamaños seleccionados en la configuración de torta.
              El precio base será el de la torta más pequeña disponible.
            </p>
          </div>

          <!-- Tipo de producto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de producto *
            </label>
            <select
              v-model="form.productType"
              @change="handleProductTypeChange"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona el tipo</option>
              <option value="simple">🧁 Producto Simple (precio fijo)</option>
              <option value="configurable">🎂 Torta Configurable (múltiples opciones)</option>
            </select>
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              v-model="form.category"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              <option value="tortas">🎂 Tortas</option>
              <option value="panaderia">🥖 Panadería</option>
              <option value="sin-azucar">🌿 Sin Azúcar</option>
              <option value="ofertas">🏷️ Ofertas</option>
            </select>
          </div>

          <!-- Producto destacado -->
          <div class="flex items-center space-x-3">
            <input 
              v-model="form.featured"
              type="checkbox"
              id="featured"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label for="featured" class="text-sm font-medium text-gray-700">
              ⭐ Producto destacado
            </label>
          </div>
        </div>

        <!-- Descripción -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea 
            v-model="form.description"
            rows="3"
            placeholder="Describe el producto, ingredientes especiales, etc."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ form.description?.length || 0 }}/200 caracteres
          </p>
        </div>
      </div>

      <!-- Imagen del producto -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <!-- Selector de imagen desde GitHub -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="text-2xl mr-3">🖼️</span>
            Imagen del Producto
          </h3>

          <GitHubImageSelector
            v-model="form.imageId"
            @image-selected="handleGitHubImageSelected"
          />
        </div>
      </div>



      <!-- Configuración de Torta (solo para productos configurables) -->
      <div v-if="form.productType === 'configurable'">
        <CakeConfigForm v-model="form.cakeConfig" />
      </div>

      <!-- Vista previa del producto -->
      <div v-if="showPreview" class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span class="text-2xl mr-3">👁️</span>
          Vista Previa
        </h3>
        
        <div class="max-w-sm mx-auto">
          <ProductCard :product="previewProduct" :preview="true" />
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          :disabled="!isFormValid || saving"
          class="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="saving" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          <span class="text-xl">{{ saving ? '⏳' : (isEditing ? '💾' : '➕') }}</span>
          <span>{{ saving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Agregar Producto') }}</span>
        </button>
        
        <button
          type="button"
          @click="resetForm"
          :disabled="saving"
          class="flex-1 sm:flex-none px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          🗑️ {{ isEditing ? 'Cancelar' : 'Limpiar' }}
        </button>
      </div>
    </form>

    <!-- Mensajes de estado -->
    <div v-if="message" class="mt-6">
      <div 
        :class="{
          'bg-green-50 border-green-200 text-green-800': message.type === 'success',
          'bg-red-50 border-red-200 text-red-800': message.type === 'error',
          'bg-blue-50 border-blue-200 text-blue-800': message.type === 'info'
        }"
        class="border rounded-lg p-4"
      >
        <div class="flex items-center space-x-2">
          <span class="text-lg">
            {{ message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️' }}
          </span>
          <span class="font-medium">{{ message.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProductsStore } from '@/stores/products'
import GitHubImageSelector from './GitHubImageSelector.vue'
import CakeConfigForm from './CakeConfigForm.vue'
import ProductCard from '@/components/products/ProductCard.vue'

// Props
const props = defineProps({
  editProduct: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['product-saved', 'cancel'])

// Store
const productsStore = useProductsStore()

// Reactive data
const form = ref({
  name: '',
  price: 0,
  category: '',
  description: '',
  featured: false,
  imageId: '',
  productType: 'simple', // 'simple' o 'configurable'
  cakeConfig: {
    sizes: [],
    fillings: [],
    extras: []
  }
})

const saving = ref(false)
const message = ref(null)
const imageLoaded = ref(false)

// Computed
const isEditing = computed(() => !!props.editProduct)

const isFormValid = computed(() => {
  const basicValid = form.value.name.trim() &&
                    form.value.category &&
                    form.value.imageId &&
                    form.value.productType

  if (form.value.productType === 'simple') {
    return basicValid && form.value.price > 0
  } else if (form.value.productType === 'configurable') {
    return basicValid &&
           form.value.cakeConfig.sizes.length > 0 &&
           form.value.cakeConfig.fillings.length > 0
  }

  return false
})

const showPreview = computed(() => {
  return isFormValid.value && imageLoaded.value
})

const previewProduct = computed(() => {
  if (!showPreview.value) return null
  
  return {
    id: 'preview',
    name: form.value.name,
    price: form.value.price,
    category: form.value.category,
    description: form.value.description,
    featured: form.value.featured,
    imageId: form.value.imageId
  }
})

// Methods
const formatPrice = (price) => {
  return productsStore.formatPrice(price)
}

const handleGitHubImageSelected = (imageData) => {
  imageLoaded.value = true
  console.log('✅ Imagen de GitHub seleccionada:', imageData)
}

const handleProductTypeChange = () => {
  // Reset price and config when changing product type
  if (form.value.productType === 'configurable') {
    form.value.price = 0
    form.value.category = 'tortas' // Auto-select tortas for configurable products
  } else {
    form.value.cakeConfig = {
      sizes: [],
      fillings: [],
      extras: []
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    showMessage('Por favor completa todos los campos requeridos', 'error')
    return
  }

  saving.value = true
  message.value = null

  try {
    // Prepare product data
    const productData = { ...form.value }

    // For configurable products, set price to the smallest size
    if (form.value.productType === 'configurable' && form.value.cakeConfig.sizes.length > 0) {
      const sizes = productsStore.cakeConfig.sizes
      const selectedSizes = sizes.filter(size => form.value.cakeConfig.sizes.includes(size.people))
      const minPrice = Math.min(...selectedSizes.map(size => size.price))
      productData.price = minPrice
    }

    if (isEditing.value) {
      await productsStore.updateProduct(props.editProduct.id, productData)
      showMessage('✅ Producto actualizado exitosamente', 'success')
    } else {
      await productsStore.addProduct(productData)
      showMessage('✅ Producto agregado exitosamente', 'success')
      resetForm()
    }

    emit('product-saved')

  } catch (error) {
    console.error('Error al guardar producto:', error)
    showMessage('❌ Error al guardar el producto. Inténtalo de nuevo.', 'error')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    price: 0,
    category: '',
    description: '',
    featured: false,
    imageId: '',
    productType: 'simple',
    cakeConfig: {
      sizes: [],
      fillings: [],
      extras: []
    }
  }
  imageLoaded.value = false
  message.value = null

  if (isEditing.value) {
    emit('cancel')
  }
}

const showMessage = (text, type = 'info') => {
  message.value = { text, type }
  
  // Auto-hide success messages
  if (type === 'success') {
    setTimeout(() => {
      message.value = null
    }, 5000)
  }
}

// Watch for edit product changes
watch(() => props.editProduct, (newProduct) => {
  if (newProduct) {
    form.value = {
      name: newProduct.name || '',
      price: newProduct.price || 0,
      category: newProduct.category || '',
      description: newProduct.description || '',
      featured: newProduct.featured || false,
      imageId: newProduct.imageId || '',
      productType: newProduct.productType || 'simple',
      cakeConfig: newProduct.cakeConfig || {
        sizes: [],
        fillings: [],
        extras: []
      }
    }

    if (newProduct.imageId) {
      imageLoaded.value = true
    }
  }
}, { immediate: true })
</script>

<style scoped>
.product-form {
  @apply max-w-4xl mx-auto;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
