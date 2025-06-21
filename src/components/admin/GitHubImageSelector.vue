<template>
  <div class="github-image-selector">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center">
        <span class="text-2xl mr-3">🐙</span>
        Selector de Imágenes GitHub
      </h3>
      <p class="text-sm text-gray-600">
        Selecciona una imagen de tu repositorio GitHub de forma visual y fácil.
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🔍 Buscar imagen:
          </label>
          <input
            v-model="searchTerm"
            @input="handleSearch"
            placeholder="Buscar por nombre de archivo..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- Category Filter -->
        <div class="md:w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📁 Categoría:
          </label>
          <select
            v-model="selectedCategory"
            @change="handleCategoryChange"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.key" :value="category.key">
              {{ category.icon }} {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Refresh Button -->
        <div class="md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            &nbsp;
          </label>
          <button
            @click="loadImages"
            :disabled="loading"
            class="w-full md:w-auto px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ loading ? '🔄' : '🔄' }} Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center space-x-3 text-purple-600">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span class="text-lg">Cargando imágenes...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600 font-medium mb-2">❌ Error al cargar imágenes</p>
      <p class="text-red-500 text-sm mb-4">{{ error }}</p>
      <button
        @click="loadImages"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        🔄 Reintentar
      </button>
    </div>

    <!-- Images Grid -->
    <div v-else-if="filteredImages.length > 0" class="space-y-6">
      <!-- Category Sections -->
      <div v-for="(categoryData, categoryKey) in groupedImages" :key="categoryKey">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span class="text-2xl mr-3">{{ categoryData.icon }}</span>
          {{ categoryData.name }}
          <span class="ml-2 text-sm text-gray-500">({{ categoryData.images.length }})</span>
        </h4>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div
            v-for="image in categoryData.images"
            :key="image.sha"
            @click="selectImage(image)"
            class="relative group cursor-pointer bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-500 transition-all duration-200 overflow-hidden"
            :class="{
              'border-purple-500 ring-2 ring-purple-200': selectedImage?.sha === image.sha
            }"
          >
            <!-- Image -->
            <div class="aspect-square">
              <img
                :src="image.rawUrl"
                :alt="image.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div class="bg-white rounded-full p-2 shadow-lg">
                  <span class="text-purple-600 text-xl">👆</span>
                </div>
              </div>
            </div>

            <!-- Selected Indicator -->
            <div v-if="selectedImage?.sha === image.sha" class="absolute top-2 right-2">
              <div class="bg-purple-500 text-white rounded-full p-1 shadow-lg">
                ✓
              </div>
            </div>

            <!-- Image Info -->
            <div class="p-2">
              <p class="text-xs text-gray-600 truncate" :title="image.name">
                {{ image.name }}
              </p>
              <p class="text-xs text-gray-400">
                {{ formatFileSize(image.size) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <span class="text-6xl">📷</span>
      </div>
      <p class="text-gray-600 text-lg mb-2">No se encontraron imágenes</p>
      <p class="text-gray-500 text-sm">
        {{ searchTerm ? 'Intenta con otro término de búsqueda' : 'Sube algunas imágenes a tu repositorio GitHub' }}
      </p>
    </div>

    <!-- Selected Image Info -->
    <div v-if="selectedImage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-medium text-green-900 mb-3 flex items-center">
        ✅ Imagen seleccionada:
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-green-800 space-y-1">
            <strong>Archivo:</strong> {{ selectedImage.name }}<br>
            <strong>Tamaño:</strong> {{ formatFileSize(selectedImage.size) }}<br>
            <strong>Categoría:</strong> {{ selectedImage.categoryName }}
          </p>
        </div>
        <div>
          <p class="text-xs text-green-700 break-all">
            <strong>URL:</strong> {{ selectedImage.rawUrl }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllProductImages, searchProductImages, githubConfig } from '@/utils/github'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'image-selected'])

// Reactive data
const loading = ref(false)
const error = ref('')
const allImages = ref({})
const searchTerm = ref('')
const selectedCategory = ref('')
const selectedImage = ref(null)

// Computed
const categories = computed(() => githubConfig.categories)

const filteredImages = computed(() => {
  let images = []
  
  // Si hay categoría seleccionada, solo mostrar esa categoría
  if (selectedCategory.value) {
    const categoryData = allImages.value[selectedCategory.value]
    if (categoryData) {
      images = categoryData.images.map(img => ({
        ...img,
        categoryKey: selectedCategory.value,
        categoryName: categoryData.name,
        categoryIcon: categoryData.icon
      }))
    }
  } else {
    // Mostrar todas las categorías
    Object.entries(allImages.value).forEach(([key, categoryData]) => {
      images.push(...categoryData.images.map(img => ({
        ...img,
        categoryKey: key,
        categoryName: categoryData.name,
        categoryIcon: categoryData.icon
      })))
    })
  }
  
  // Filtrar por término de búsqueda
  if (searchTerm.value) {
    images = images.filter(img => 
      img.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  return images
})

const groupedImages = computed(() => {
  const grouped = {}
  
  filteredImages.value.forEach(image => {
    if (!grouped[image.categoryKey]) {
      grouped[image.categoryKey] = {
        name: image.categoryName,
        icon: image.categoryIcon,
        images: []
      }
    }
    grouped[image.categoryKey].images.push(image)
  })
  
  return grouped
})

// Methods
const loadImages = async () => {
  loading.value = true
  error.value = ''
  
  try {
    allImages.value = await getAllProductImages()
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar imágenes'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // La búsqueda es reactiva a través del computed
}

const handleCategoryChange = () => {
  // El filtro es reactivo a través del computed
}

const selectImage = (image) => {
  selectedImage.value = image
  emit('update:modelValue', image.rawUrl)
  emit('image-selected', {
    url: image.rawUrl,
    name: image.name,
    category: image.categoryName,
    size: image.size
  })
}

const handleImageError = (event) => {
  console.warn('Error cargando imagen:', event.target.src)
  // Podrías mostrar una imagen placeholder aquí
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  loadImages()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
