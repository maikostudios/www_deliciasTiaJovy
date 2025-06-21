<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="max-h-96 overflow-y-auto space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
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

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Describe el producto, ingredientes, características especiales..."
            ></textarea>
          </div>

          <!-- Pricing -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
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

          <!-- Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Imagen del Producto
            </label>
            <div class="space-y-3">
              <!-- Image Preview -->
              <div v-if="form.imageUrl || imagePreview" class="relative">
                <img
                  :src="imagePreview || form.imageUrl"
                  :alt="form.name"
                  class="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>

              <!-- Image Input Options -->
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    URL de imagen
                  </label>
                  <input
                    v-model="form.imageUrl"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div class="text-center text-gray-500 text-sm">o</div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Subir archivo
                  </label>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">JPG, PNG, máximo 2MB</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                v-model="form.featured"
                type="checkbox"
                id="featured"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="featured" class="ml-2 block text-sm text-gray-700">
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
              <label for="active" class="ml-2 block text-sm text-gray-700">
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
              <label for="customizable" class="ml-2 block text-sm text-gray-700">
                🎨 Producto personalizable (tortas)
              </label>
            </div>
          </div>

          <!-- Customization Options (if customizable) -->
          <div v-if="form.customizable" class="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900">Opciones de Personalización</h4>
            
            <!-- Size Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tamaños disponibles
              </label>
              <div class="space-y-2">
                <div v-for="size in availableSizes" :key="size.value" class="flex items-center">
                  <input
                    v-model="form.customization.sizes"
                    :value="size"
                    type="checkbox"
                    :id="`size-${size.value}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label :for="`size-${size.value}`" class="ml-2 block text-sm text-gray-700">
                    {{ size.label }} - {{ formatCurrency(size.price) }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Filling Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Rellenos disponibles
              </label>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="filling in availableFillings" :key="filling" class="flex items-center">
                  <input
                    v-model="form.customization.fillings"
                    :value="filling"
                    type="checkbox"
                    :id="`filling-${filling}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label :for="`filling-${filling}`" class="ml-2 block text-sm text-gray-700">
                    {{ filling }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Extra Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Extras disponibles
              </label>
              <div class="space-y-2">
                <div v-for="extra in availableExtras" :key="extra.name" class="flex items-center">
                  <input
                    v-model="form.customization.extras"
                    :value="extra"
                    type="checkbox"
                    :id="`extra-${extra.name}`"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label :for="`extra-${extra.name}`" class="ml-2 block text-sm text-gray-700">
                    {{ extra.name }} - {{ formatCurrency(extra.price) }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <span v-if="loading">Guardando...</span>
            <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }} Producto</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useProductsStore } from '@/stores/products'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const productsStore = useProductsStore()

// State
const loading = ref(false)
const imagePreview = ref(null)
const fileInput = ref(null)

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
  customization: {
    sizes: [],
    fillings: [],
    extras: []
  }
})

// Available options for customization
const availableSizes = [
  { value: '10', label: '10 personas', price: 22000 },
  { value: '15', label: '15 personas', price: 27000 },
  { value: '20', label: '20 personas', price: 32000 },
  { value: '25', label: '25 personas', price: 37000 },
  { value: '30', label: '30 personas', price: 42000 },
  { value: '35', label: '35 personas', price: 47000 },
  { value: '40', label: '40 personas', price: 52000 }
]

const availableFillings = [
  'Piña', 'Durazno', 'Moca', 'Frutilla', 'Selva Negra', 'Frambuesa',
  'Crema Pastelera', 'Crema Chantilly', 'Manjar'
]

const availableExtras = [
  { name: 'Láminas de Chocolate', price: 2000 },
  { name: 'Toppers Personalizados', price: 3000 },
  { name: 'Nueces', price: 1500 },
  { name: 'Tercer Relleno', price: 2500 }
]

// Computed
const isEditing = computed(() => !!props.product)

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('El archivo es demasiado grande. Máximo 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
      form.value.imageUrl = '' // Clear URL when file is uploaded
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  form.value.imageUrl = ''
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true

    const productData = {
      ...form.value,
      imageUrl: imagePreview.value || form.value.imageUrl,
      updatedAt: new Date()
    }

    if (isEditing.value) {
      await productsStore.updateProduct(props.product.id, productData)
    } else {
      productData.createdAt = new Date()
      await productsStore.addProduct(productData)
    }

    emit('saved')
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Error al guardar el producto. Por favor, inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}

// Initialize form with product data if editing
onMounted(() => {
  if (props.product) {
    form.value = {
      ...props.product,
      customization: props.product.customization || {
        sizes: [],
        fillings: [],
        extras: []
      }
    }
  }
})
</script>
