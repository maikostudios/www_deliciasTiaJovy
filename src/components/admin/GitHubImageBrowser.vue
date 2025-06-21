<template>
  <div class="github-image-browser">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Seleccionar Imagen</h3>
        <p class="text-sm text-gray-600">Elige una imagen del repositorio de GitHub</p>
      </div>
      <div class="flex items-center space-x-3">
        <!-- Upload Button -->
        <label class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
          <CloudArrowUpIcon class="h-4 w-4 mr-2" />
          Subir Nueva
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileUpload"
            class="hidden"
          />
        </label>
        <button
          @click="refreshImages"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': loading }]" />
          Actualizar
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar imágenes..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeCategory === category.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <span class="mr-2">{{ category.icon }}</span>
            {{ category.name }}
            <span v-if="category.count" class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
              {{ category.count }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <ArrowPathIcon class="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p class="text-gray-600">Cargando imágenes...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-600 mr-2" />
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Images Grid -->
    <div v-else-if="filteredImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="image in filteredImages"
        :key="image.path"
        @click="selectImage(image)"
        :class="[
          'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200',
          selectedImage?.path === image.path
            ? 'border-primary ring-2 ring-primary ring-opacity-50'
            : 'border-gray-200 hover:border-gray-300'
        ]"
      >
        <!-- Image -->
        <div class="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            :src="image.url"
            :alt="image.name"
            class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            @error="handleImageError"
            loading="lazy"
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <CheckCircleIcon
              v-if="selectedImage?.path === image.path"
              class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        </div>

        <!-- Image Info -->
        <div class="p-2 bg-white">
          <p class="text-xs font-medium text-gray-900 truncate" :title="image.name">
            {{ image.name }}
          </p>
          <p class="text-xs text-gray-500">{{ formatFileSize(image.size) }}</p>
        </div>

        <!-- Selected Badge -->
        <div
          v-if="selectedImage?.path === image.path"
          class="absolute top-2 right-2 bg-primary text-white rounded-full p-1"
        >
          <CheckIcon class="h-3 w-3" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <PhotoIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay imágenes</h3>
      <p class="text-gray-600 mb-4">
        {{ searchQuery ? 'No se encontraron imágenes con ese término' : 'No hay imágenes en esta categoría' }}
      </p>
      <label class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
        <CloudArrowUpIcon class="h-4 w-4 mr-2" />
        Subir Primera Imagen
        <input
          type="file"
          accept="image/*"
          multiple
          @change="handleFileUpload"
          class="hidden"
        />
      </label>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploadProgress.length > 0" class="mt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Subiendo imágenes...</h4>
      <div class="space-y-2">
        <div v-for="upload in uploadProgress" :key="upload.name" class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-900">{{ upload.name }}</span>
            <span class="text-sm text-gray-600">{{ upload.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${upload.progress}%` }"
            ></div>
          </div>
          <p v-if="upload.error" class="text-xs text-red-600 mt-1">{{ upload.error }}</p>
        </div>
      </div>
    </div>

    <!-- Selected Image Preview -->
    <div v-if="selectedImage" class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Imagen Seleccionada:</h4>
      <div class="flex items-center space-x-3">
        <img
          :src="selectedImage.url"
          :alt="selectedImage.name"
          class="w-16 h-16 object-cover rounded-lg border border-gray-200"
        />
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ selectedImage.name }}</p>
          <p class="text-xs text-gray-600">{{ selectedImage.category }} • {{ formatFileSize(selectedImage.size) }}</p>
          <p class="text-xs text-gray-500 font-mono">{{ selectedImage.url }}</p>
        </div>
        <button
          @click="clearSelection"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CloudArrowUpIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  CheckCircleIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'image-selected'])

// State
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const activeCategory = ref('all')
const selectedImage = ref(null)
const uploadProgress = ref([])
const fileInput = ref(null)

// GitHub repository info
const GITHUB_REPO = 'maikostudios/assets_delicias_tia_jovy'
const GITHUB_BRANCH = 'main'
const IMAGES_PATH = 'assets/img/productos'

// Categories
const categories = ref([
  { id: 'all', name: 'Todas', icon: '🖼️', count: 0 },
  { id: 'Combos', name: 'Combos', icon: '🍽️', count: 0 },
  { id: 'Panes', name: 'Panes', icon: '🥖', count: 0 },
  { id: 'Postres', name: 'Postres', icon: '🍰', count: 0 },
  { id: 'Salados', name: 'Salados', icon: '🥪', count: 0 },
  { id: 'Tortas', name: 'Tortas', icon: '🎂', count: 0 }
])

// Images data
const images = ref([])

// Computed
const filteredImages = computed(() => {
  let filtered = images.value

  // Filter by category
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(img => img.category === activeCategory.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(img =>
      img.name.toLowerCase().includes(query) ||
      img.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const fetchImages = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${IMAGES_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const imageFiles = []

    // Process folders and files
    for (const item of data) {
      if (item.type === 'dir') {
        // Fetch images from subfolder
        const subResponse = await fetch(item.url)
        const subData = await subResponse.json()
        
        for (const subItem of subData) {
          if (subItem.type === 'file' && isImageFile(subItem.name)) {
            imageFiles.push({
              name: subItem.name,
              path: subItem.path,
              url: `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${subItem.path}`,
              category: item.name,
              size: subItem.size,
              sha: subItem.sha
            })
          }
        }
      } else if (item.type === 'file' && isImageFile(item.name)) {
        // Direct file in productos folder
        imageFiles.push({
          name: item.name,
          path: item.path,
          url: `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${item.path}`,
          category: 'General',
          size: item.size,
          sha: item.sha
        })
      }
    }

    images.value = imageFiles

    // Update category counts
    updateCategoryCounts()

  } catch (err) {
    error.value = err.message
    console.error('Error fetching images:', err)
  } finally {
    loading.value = false
  }
}

const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

const updateCategoryCounts = () => {
  const counts = {}
  images.value.forEach(img => {
    counts[img.category] = (counts[img.category] || 0) + 1
  })

  categories.value.forEach(cat => {
    if (cat.id === 'all') {
      cat.count = images.value.length
    } else {
      cat.count = counts[cat.id] || 0
    }
  })
}

const selectImage = (image) => {
  selectedImage.value = image
  emit('update:modelValue', image.url)
  emit('image-selected', image)
}

const clearSelection = () => {
  selectedImage.value = null
  emit('update:modelValue', '')
  emit('image-selected', null)
}

const refreshImages = () => {
  fetchImages()
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400 text-2xl">🖼️</span></div>'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  try {
    // Import upload utility
    const { batchUploadImages } = await import('@/utils/github-upload.js')

    // Determine category based on active category
    const category = activeCategory.value === 'all' ? 'General' : activeCategory.value

    // Initialize upload progress
    uploadProgress.value = files.map(file => ({
      name: file.name,
      progress: 0,
      error: null
    }))

    // Upload files
    const results = await batchUploadImages(
      files,
      category,
      (overallProgress, currentFile, totalFiles, fileName) => {
        // Update progress for current file
        const progressIndex = uploadProgress.value.findIndex(p => p.name === fileName)
        if (progressIndex !== -1) {
          uploadProgress.value[progressIndex].progress = Math.round(overallProgress)
        }
      }
    )

    // Process results
    let successCount = 0
    let errorCount = 0

    results.forEach((result, index) => {
      const progressItem = uploadProgress.value[index]

      if (result.success) {
        successCount++
        progressItem.progress = 100

        // Add to images list if successful
        images.value.push({
          name: result.name,
          path: result.path,
          url: result.url,
          category: result.category,
          size: files[index].size,
          sha: result.sha
        })
      } else {
        errorCount++
        progressItem.error = result.error
      }
    })

    // Update category counts
    updateCategoryCounts()

    // Show summary
    if (successCount > 0) {
      alert(`✅ ${successCount} imagen(es) subida(s) exitosamente!`)
    }

    if (errorCount > 0) {
      alert(`❌ ${errorCount} imagen(es) fallaron. Revisa los detalles arriba.`)
    }

    // Clear upload progress after 3 seconds
    setTimeout(() => {
      uploadProgress.value = []
    }, 3000)

  } catch (error) {
    console.error('Upload error:', error)
    alert(`Error durante la subida: ${error.message}`)
    uploadProgress.value = []
  }

  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Initialize
onMounted(() => {
  fetchImages()
  
  // Set initial selection if modelValue is provided
  if (props.modelValue) {
    const existingImage = images.value.find(img => img.url === props.modelValue)
    if (existingImage) {
      selectedImage.value = existingImage
    }
  }
})
</script>
