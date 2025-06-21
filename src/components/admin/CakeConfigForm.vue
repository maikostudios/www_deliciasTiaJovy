<template>
  <div class="cake-config-form space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center">
        <span class="text-2xl mr-3">🎂</span>
        Configuración de Torta
      </h3>
      <p class="text-sm text-gray-600">
        Configura los tamaños, rellenos y extras disponibles para esta torta.
      </p>
    </div>

    <!-- Tamaños y Precios -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="text-xl mr-2">📏</span>
        Tamaños Disponibles
      </h4>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="size in availableSizes" 
          :key="size.people"
          class="relative"
        >
          <input
            :id="`size-${size.people}`"
            v-model="selectedSizes"
            :value="size.people"
            type="checkbox"
            class="sr-only"
          />
          <label
            :for="`size-${size.people}`"
            :class="[
              'block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
              selectedSizes.includes(size.people)
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">
                {{ size.people }} personas
              </div>
              <div class="text-sm text-primary font-medium">
                {{ formatPrice(size.price) }}
              </div>
            </div>
            <div 
              v-if="selectedSizes.includes(size.people)"
              class="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              ✓
            </div>
          </label>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Selecciona todos los tamaños que quieres ofrecer para esta torta.
        </p>
      </div>
    </div>

    <!-- Rellenos -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="text-xl mr-2">🥧</span>
        Rellenos Disponibles
      </h4>
      
      <!-- Rellenos por categoría -->
      <div class="space-y-6">
        <div v-for="category in fillingCategories" :key="category.id">
          <h5 class="font-medium text-gray-800 mb-3 flex items-center">
            <span class="text-lg mr-2">{{ category.icon }}</span>
            {{ category.name }}
          </h5>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              v-for="filling in getFillingsByCategory(category.id)" 
              :key="filling.id"
              class="relative"
            >
              <input
                :id="`filling-${filling.id}`"
                v-model="selectedFillings"
                :value="filling.id"
                type="checkbox"
                class="sr-only"
              />
              <label
                :for="`filling-${filling.id}`"
                :class="[
                  'block p-3 border rounded-lg cursor-pointer transition-all duration-200 text-sm',
                  selectedFillings.includes(filling.id)
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                ]"
              >
                {{ filling.name }}
                <div 
                  v-if="selectedFillings.includes(filling.id)"
                  class="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✓
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-green-50 rounded-lg" style="padding: clamp(1rem, 3vw, 1.5rem);">
        <p class="text-sm text-green-800 mb-2">
          🎨 <strong>Combinaciones personalizadas:</strong>
        </p>
        <p class="text-xs text-green-700">
          Los clientes pueden combinar los rellenos como deseen. Los rellenos seleccionados aparecerán como opciones en la tienda.
        </p>
      </div>
    </div>

    <!-- Extras -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="text-xl mr-2">✨</span>
        Extras y Personalizaciones
      </h4>
      
      <div class="space-y-4">
        <div 
          v-for="extra in availableExtras" 
          :key="extra.id"
          class="relative"
        >
          <input
            :id="`extra-${extra.id}`"
            v-model="selectedExtras"
            :value="extra.id"
            type="checkbox"
            class="sr-only"
          />
          <label
            :for="`extra-${extra.id}`"
            :class="[
              'block p-4 border rounded-lg cursor-pointer transition-all duration-200',
              selectedExtras.includes(extra.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">{{ extra.name }}</div>
                <div class="text-sm text-gray-600">{{ extra.description }}</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-primary">
                  {{ extra.price === 'variable' ? 'Precio variable' : formatPrice(extra.price) }}
                </div>
              </div>
            </div>
            <div 
              v-if="selectedExtras.includes(extra.id)"
              class="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              ✓
            </div>
          </label>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p class="text-sm text-yellow-800">
          💰 <strong>Precios variables:</strong> Para láminas comestibles y toppers, el precio se cotiza según el diseño específico.
        </p>
      </div>
    </div>

    <!-- Resumen de configuración -->
    <div v-if="hasConfiguration" class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
      <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="text-xl mr-2">📋</span>
        Resumen de Configuración
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h5 class="font-medium text-gray-800 mb-2">Tamaños ({{ selectedSizes.length }})</h5>
          <ul class="space-y-1 text-gray-600">
            <li v-for="size in selectedSizeObjects" :key="size.people">
              {{ size.people }} personas - {{ formatPrice(size.price) }}
            </li>
          </ul>
        </div>
        
        <div>
          <h5 class="font-medium text-gray-800 mb-2">Rellenos ({{ selectedFillings.length }})</h5>
          <ul class="space-y-1 text-gray-600 max-h-32 overflow-y-auto">
            <li v-for="filling in selectedFillingObjects" :key="filling.id">
              {{ filling.name }}
            </li>
          </ul>
        </div>
        
        <div>
          <h5 class="font-medium text-gray-800 mb-2">Extras ({{ selectedExtras.length }})</h5>
          <ul class="space-y-1 text-gray-600">
            <li v-for="extra in selectedExtraObjects" :key="extra.id">
              {{ extra.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProductsStore } from '@/stores/products'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      sizes: [],
      fillings: [],
      extras: []
    })
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Store
const productsStore = useProductsStore()

// Reactive data
const selectedSizes = ref([])
const selectedFillings = ref([])
const selectedExtras = ref([])

// Computed
const availableSizes = computed(() => productsStore.cakeConfig.sizes)
const availableFillings = computed(() => productsStore.cakeConfig.fillings)
const availableExtras = computed(() => productsStore.cakeConfig.extras)

const fillingCategories = computed(() => [
  { id: 'frutal', name: 'Rellenos Frutales', icon: '🍓' },
  { id: 'chocolate', name: 'Rellenos de Chocolate', icon: '🍫' }
])

const selectedSizeObjects = computed(() => {
  return availableSizes.value.filter(size => selectedSizes.value.includes(size.people))
})

const selectedFillingObjects = computed(() => {
  return availableFillings.value.filter(filling => selectedFillings.value.includes(filling.id))
})

const selectedExtraObjects = computed(() => {
  return availableExtras.value.filter(extra => selectedExtras.value.includes(extra.id))
})

const hasConfiguration = computed(() => {
  return selectedSizes.value.length > 0 || selectedFillings.value.length > 0 || selectedExtras.value.length > 0
})

// Methods
const formatPrice = (price) => {
  return productsStore.formatPrice(price)
}

const getFillingsByCategory = (category) => {
  return availableFillings.value.filter(filling => filling.category === category)
}

// Watch for changes and emit
watch([selectedSizes, selectedFillings, selectedExtras], () => {
  const config = {
    sizes: selectedSizes.value,
    fillings: selectedFillings.value,
    extras: selectedExtras.value
  }
  
  emit('update:modelValue', config)
}, { deep: true })

// Initialize from props
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedSizes.value = newValue.sizes || []
    selectedFillings.value = newValue.fillings || []
    selectedExtras.value = newValue.extras || []
  }
}, { immediate: true })
</script>

<style scoped>
.cake-config-form {
  @apply space-y-6;
}
</style>
