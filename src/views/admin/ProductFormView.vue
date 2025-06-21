<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5 mr-2" />
              Volver
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
              </h1>
              <p class="text-gray-600">
                {{ isEditing ? 'Modifica la información del producto' : 'Completa los datos para crear un nuevo producto' }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="goBack"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="handleSave"
              :disabled="!isFormValid || saving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">Guardando...</span>
              <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }} Producto</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span class="text-xl mr-3">📝</span>
              Información Básica
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Torta de Chocolate"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="tortas">🎂 Tortas</option>
                  <option value="panaderia">🥖 Panadería</option>
                  <option value="sin-azucar">🌿 Sin Azúcar</option>
                  <option value="ofertas">🏷️ Ofertas</option>
                </select>
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                v-model="form.description"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe el producto, ingredientes, características especiales..."
              ></textarea>
            </div>
          </div>

          <!-- Pricing -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span class="text-xl mr-3">💰</span>
              Precios
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model.number="form.price"
                    type="number"
                    required
                    min="0"
                    step="100"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Precio Original (opcional)
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    v-model.number="form.originalPrice"
                    type="number"
                    min="0"
                    step="100"
                    class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1">Para mostrar descuentos</p>
              </div>
            </div>
          </div>

          <!-- Product Options -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span class="text-xl mr-3">⚙️</span>
              Opciones del Producto
            </h2>

            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="form.featured"
                  type="checkbox"
                  id="featured"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label for="featured" class="ml-3 block text-sm text-gray-700">
                  ⭐ Producto destacado
                </label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="form.active"
                  type="checkbox"
                  id="active"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label for="active" class="ml-3 block text-sm text-gray-700">
                  ✅ Producto activo
                </label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="form.customizable"
                  type="checkbox"
                  id="customizable"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label for="customizable" class="ml-3 block text-sm text-gray-700">
                  🎨 Producto personalizable (tortas)
                </label>
              </div>
            </div>
          </div>

          <!-- Cake Configuration (only for customizable products) -->
          <div v-if="form.customizable" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span class="text-xl mr-3">🎂</span>
              Configuración de Tortas
            </h2>

            <!-- Size Options -->
            <div class="mb-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Tamaños Disponibles</h3>
              <div class="space-y-3">
                <div v-for="size in cakeSizes" :key="size.people" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div class="flex items-center">
                    <input
                      v-model="form.cakeConfig.availableSizes"
                      :value="size.people"
                      type="checkbox"
                      :id="`size-${size.people}`"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label :for="`size-${size.people}`" class="ml-3 text-sm text-gray-700">
                      👥 {{ size.people }} personas
                    </label>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(size.price) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Filling Options -->
            <div class="mb-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Rellenos Disponibles</h3>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="filling in cakeFillings" :key="filling.id" class="flex items-center">
                  <input
                    v-model="form.cakeConfig.availableFillings"
                    :value="filling.id"
                    type="checkbox"
                    :id="`filling-${filling.id}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label :for="`filling-${filling.id}`" class="ml-3 text-sm text-gray-700">
                    {{ filling.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Extra Options -->
            <div class="mb-6">
              <h3 class="text-md font-medium text-gray-900 mb-4">Extras Disponibles</h3>
              <div class="space-y-3">
                <div v-for="extra in cakeExtras" :key="extra.id" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div class="flex items-center">
                    <input
                      v-model="form.cakeConfig.availableExtras"
                      :value="extra.id"
                      type="checkbox"
                      :id="`extra-${extra.id}`"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label :for="`extra-${extra.id}`" class="ml-3 text-sm text-gray-700">
                      {{ extra.name }}
                    </label>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    +{{ formatCurrency(extra.price) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration Notes -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-900 mb-2">📋 Notas de Configuración</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Los precios base son para tortas de 10-40 personas</li>
                <li>• Los rellenos se pueden combinar (máximo 2 por torta)</li>
                <li>• Los extras se cobran adicionales al precio base</li>
                <li>• El tercer relleno y las nueces tienen costo extra</li>
              </ul>
            </div>
          </div>

          <!-- Image Selection -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span class="text-xl mr-3">🖼️</span>
              Imagen del Producto
            </h2>
            
            <GitHubImageBrowser
              v-model="form.imageUrl"
              @image-selected="handleImageSelected"
            />
          </div>
        </div>

        <!-- Preview Section -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <!-- Product Preview -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span class="text-xl mr-3">👁️</span>
                Vista Previa
              </h2>
              
              <div v-if="showPreview" class="border border-gray-200 rounded-lg overflow-hidden">
                <!-- Custom preview since ProductCard might not exist -->
                <div class="bg-white">
                  <!-- Product Image -->
                  <div class="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      v-if="form.imageUrl"
                      :src="form.imageUrl"
                      :alt="form.name"
                      class="w-full h-full object-cover"
                      @error="handlePreviewImageError"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-6xl">
                      {{ getCategoryEmoji(form.category) }}
                    </div>

                    <!-- Featured Badge -->
                    <div v-if="form.featured" class="absolute top-2 right-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Destacado
                      </span>
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ form.name || 'Nombre del producto' }}</h3>
                      <span class="text-sm text-gray-500 ml-2">{{ getCategoryName(form.category) }}</span>
                    </div>

                    <p class="text-gray-600 text-sm mb-3">{{ form.description || 'Descripción del producto' }}</p>

                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-lg font-bold text-primary">{{ formatCurrency(form.price) }}</span>
                        <span v-if="form.originalPrice" class="text-sm text-gray-500 line-through">
                          {{ formatCurrency(form.originalPrice) }}
                        </span>
                      </div>
                      <div v-if="form.originalPrice && form.price" class="text-xs font-medium text-green-600">
                        -{{ Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100) }}%
                      </div>
                    </div>

                    <!-- Add to Cart Button -->
                    <button class="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium">
                      🛒 Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">Completa los campos para ver la vista previa</p>
              </div>
            </div>

            <!-- Form Status -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Estado del Formulario</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Nombre</span>
                  <span class="text-xs">
                    {{ form.name ? '✅' : '❌' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Categoría</span>
                  <span class="text-xs">
                    {{ form.category ? '✅' : '❌' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Descripción</span>
                  <span class="text-xs">
                    {{ form.description ? '✅' : '❌' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Precio</span>
                  <span class="text-xs">
                    {{ form.price > 0 ? '✅' : '❌' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Imagen</span>
                  <span class="text-xs">
                    {{ form.imageUrl ? '✅' : '❌' }}
                  </span>
                </div>
                <div v-if="form.customizable" class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Config. Torta</span>
                  <span class="text-xs">
                    {{ (form.cakeConfig.availableSizes.length > 0 && form.cakeConfig.availableFillings.length > 0) ? '✅' : '❌' }}
                  </span>
                </div>
              </div>
              
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-900">Formulario Válido</span>
                  <span class="text-sm font-medium">
                    {{ isFormValid ? '✅ Listo' : '❌ Incompleto' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import GitHubImageBrowser from '@/components/admin/GitHubImageBrowser.vue'


const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

// State
const saving = ref(false)
const selectedImageData = ref(null)

// Cake configuration options
const cakeSizes = ref([
  { people: 10, price: 22000 },
  { people: 15, price: 27000 },
  { people: 20, price: 32000 },
  { people: 25, price: 37000 },
  { people: 30, price: 42000 },
  { people: 35, price: 47000 },
  { people: 40, price: 52000 }
])

const cakeFillings = ref([
  { id: 'pina', name: '🍍 Piña' },
  { id: 'durazno', name: '🍑 Durazno' },
  { id: 'moca', name: '☕ Moca' },
  { id: 'frutilla', name: '🍓 Frutilla' },
  { id: 'selva-negra', name: '🍒 Selva Negra' },
  { id: 'frambuesa', name: '🫐 Frambuesa' },
  { id: 'crema-pastelera', name: '🍮 Crema Pastelera' },
  { id: 'crema-chantilly', name: '🥛 Crema Chantilly' },
  { id: 'manjar', name: '🍯 Manjar' }
])

const cakeExtras = ref([
  { id: 'lamina-chocolate', name: '🍫 Lámina de Chocolate', price: 2000 },
  { id: 'lamina-blanca', name: '🤍 Lámina Blanca', price: 2000 },
  { id: 'topper-personalizado', name: '🎯 Topper Personalizado', price: 3000 },
  { id: 'nueces', name: '🥜 Nueces', price: 1500 },
  { id: 'tercer-relleno', name: '🎂 Tercer Relleno', price: 2500 },
  { id: 'decoracion-especial', name: '✨ Decoración Especial', price: 5000 }
])

// Form data
const form = ref({
  name: '',
  description: '',
  price: 0,
  originalPrice: null,
  category: '',
  imageUrl: '',
  featured: false,
  active: true,
  customizable: false,
  cakeConfig: {
    availableSizes: [],
    availableFillings: [],
    availableExtras: []
  }
})

// Computed
const isEditing = computed(() => !!route.params.id)

const isFormValid = computed(() => {
  const basicValid = form.value.name.trim() &&
                    form.value.category &&
                    form.value.description.trim() &&
                    form.value.price > 0 &&
                    form.value.imageUrl

  // If customizable, also check cake configuration
  if (form.value.customizable) {
    const cakeConfigValid = form.value.cakeConfig.availableSizes.length > 0 &&
                           form.value.cakeConfig.availableFillings.length > 0
    return basicValid && cakeConfigValid
  }

  return basicValid
})

const showPreview = computed(() => {
  return isFormValid.value
})

const previewProduct = computed(() => {
  return {
    id: 'preview',
    name: form.value.name || 'Nombre del producto',
    description: form.value.description || 'Descripción del producto',
    price: form.value.price || 0,
    originalPrice: form.value.originalPrice || null,
    category: form.value.category || 'general',
    imageUrl: form.value.imageUrl || '',
    featured: form.value.featured,
    active: form.value.active
  }
})

// Methods
const goBack = () => {
  router.push('/admin')
}

const handleImageSelected = (imageData) => {
  selectedImageData.value = imageData
}

const handlePreviewImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-6xl">${getCategoryEmoji(form.value.category)}</div>`
}

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
  return names[category] || 'General'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount || 0)
}

const handleSave = async () => {
  if (!isFormValid.value) return

  try {
    saving.value = true

    const productData = {
      ...form.value,
      updatedAt: new Date()
    }

    if (isEditing.value) {
      await productsStore.updateProduct(route.params.id, productData)
    } else {
      productData.createdAt = new Date()
      await productsStore.addProduct(productData)
    }

    // Redirect back to admin
    router.push('/admin?section=products')
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Error al guardar el producto. Por favor, inténtalo de nuevo.')
  } finally {
    saving.value = false
  }
}

// Initialize
onMounted(async () => {
  if (isEditing.value) {
    // Load existing product
    const product = productsStore.products.find(p => p.id === route.params.id)
    if (product) {
      form.value = { ...product }
    } else {
      // Product not found, redirect back
      router.push('/admin?section=products')
    }
  }
})
</script>
