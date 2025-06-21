<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <p class="text-gray-600">Administra el catálogo de Delicias Tía Jovy</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <RouterLink
          to="/admin/productos/nuevo"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Nuevo Producto
        </RouterLink>
        <button
          @click="refreshProducts"
          :disabled="productsStore.loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
        >
          <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': productsStore.loading }]" />
          Actualizar
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-purple-600 text-lg">🧁</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Productos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ productsStore.products.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-green-600 text-lg">✅</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Activos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ activeProducts.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-blue-600 text-lg">🏷️</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Categorías</p>
            <p class="text-2xl font-semibold text-gray-900">{{ categoriesCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span class="text-yellow-600 text-lg">⭐</span>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Destacados</p>
            <p class="text-2xl font-semibold text-gray-900">{{ featuredProducts.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o descripción..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            v-model="categoryFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="tortas">🎂 Tortas</option>
            <option value="panaderia">🥖 Panadería</option>
            <option value="sin-azucar">🌿 Sin Azúcar</option>
            <option value="ofertas">🏷️ Ofertas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="productsStore.loading" class="p-8 text-center text-gray-500">
        <div class="flex items-center justify-center">
          <ArrowPathIcon class="h-5 w-5 animate-spin mr-2" />
          Cargando productos...
        </div>
      </div>
      <div v-else-if="filteredProducts.length === 0" class="p-8 text-center text-gray-500">
        <div class="text-4xl mb-2">🧁</div>
        <p>{{ searchQuery || categoryFilter || statusFilter ? 'No se encontraron productos con los filtros aplicados' : 'No hay productos registrados' }}</p>
        <RouterLink
          v-if="!searchQuery && !categoryFilter && !statusFilter"
          to="/admin/productos/nuevo"
          class="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Crear primer producto
        </RouterLink>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <!-- Product Image -->
          <div class="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-6xl">
              {{ getCategoryEmoji(product.category) }}
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-2 left-2">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  product.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ product.active !== false ? '✅ Activo' : '❌ Inactivo' }}
              </span>
            </div>

            <!-- Featured Badge -->
            <div v-if="product.featured" class="absolute top-2 right-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⭐ Destacado
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ product.name }}</h3>
              <span class="text-sm text-gray-500 ml-2">{{ getCategoryName(product.category) }}</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <span class="text-lg font-bold text-primary">{{ formatCurrency(product.price) }}</span>
                <span v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                  {{ formatCurrency(product.originalPrice) }}
                </span>
              </div>
              <div v-if="product.originalPrice" class="text-xs font-medium text-green-600">
                -{{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <RouterLink
                :to="`/admin/productos/editar/${product.id}`"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <PencilIcon class="h-4 w-4 mr-1" />
                Editar
              </RouterLink>
              <button
                @click="toggleProductStatus(product)"
                :class="[
                  'flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  product.active !== false
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                ]"
              >
                {{ product.active !== false ? '❌ Desactivar' : '✅ Activar' }}
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="productsStore.error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600 text-sm">{{ productsStore.error }}</p>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { PlusIcon, ArrowPathIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'


const productsStore = useProductsStore()

// State
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// Computed properties
const filteredProducts = computed(() => {
  let filtered = productsStore.products

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  // Status filter
  if (statusFilter.value) {
    if (statusFilter.value === 'active') {
      filtered = filtered.filter(product => product.active !== false)
    } else if (statusFilter.value === 'inactive') {
      filtered = filtered.filter(product => product.active === false)
    }
  }

  return filtered
})

const activeProducts = computed(() => {
  return productsStore.products.filter(product => product.active !== false)
})

const featuredProducts = computed(() => {
  return productsStore.products.filter(product => product.featured)
})

const categoriesCount = computed(() => {
  const categories = new Set(productsStore.products.map(product => product.category))
  return categories.size
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount)
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
  return names[category] || 'Producto'
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}



const toggleProductStatus = async (product) => {
  try {
    const newStatus = product.active === false ? true : false
    await productsStore.updateProduct(product.id, { active: newStatus })
  } catch (error) {
    console.error('Error toggling product status:', error)
  }
}

const deleteProduct = async (productId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
    try {
      await productsStore.deleteProduct(productId)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

const refreshProducts = async () => {
  await productsStore.fetchProducts()
}



onMounted(async () => {
  // Load products when component mounts
  await productsStore.fetchProducts()
})
</script>
