import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([
    // Tortas
    {
      id: 1,
      name: 'Torta de Chocolate',
      price: 15000,
      category: 'tortas',
      image: '/images/torta-chocolate.jpg',
      description: 'Deliciosa torta de chocolate con relleno de manjar',
      featured: true
    },
    {
      id: 2,
      name: 'Torta de Frutilla',
      price: 18000,
      category: 'tortas',
      image: '/images/torta-frutilla.jpg',
      description: 'Torta esponjosa con crema y frutillas frescas',
      featured: true
    },
    {
      id: 3,
      name: 'Torta Tres Leches',
      price: 16000,
      category: 'tortas',
      image: '/images/torta-tres-leches.jpg',
      description: 'Clásica torta tres leches con canela',
      featured: false
    },
    
    // Panadería
    {
      id: 4,
      name: 'Pan Amasado',
      price: 1500,
      category: 'panaderia',
      image: '/images/pan-amasado.jpg',
      description: 'Pan amasado tradicional, recién horneado',
      featured: true
    },
    {
      id: 5,
      name: 'Empanadas de Pino',
      price: 2500,
      category: 'panaderia',
      image: '/images/empanadas.jpg',
      description: 'Empanadas caseras de pino con huevo y aceituna',
      featured: false
    },
    {
      id: 6,
      name: 'Sopaipillas',
      price: 500,
      category: 'panaderia',
      image: '/images/sopaipillas.jpg',
      description: 'Sopaipillas crujientes, perfectas para el té',
      featured: false
    },
    
    // Sin Azúcar
    {
      id: 7,
      name: 'Torta Sin Azúcar',
      price: 20000,
      category: 'sin-azucar',
      image: '/images/torta-sin-azucar.jpg',
      description: 'Torta especial endulzada con stevia',
      featured: true
    },
    {
      id: 8,
      name: 'Galletas Integrales',
      price: 3000,
      category: 'sin-azucar',
      image: '/images/galletas-integrales.jpg',
      description: 'Galletas integrales sin azúcar añadida',
      featured: false
    },
    
    // Ofertas
    {
      id: 9,
      name: 'Combo Desayuno',
      price: 8000,
      category: 'ofertas',
      image: '/images/combo-desayuno.jpg',
      description: 'Pan amasado + mermelada + mantequilla + té',
      featured: true,
      originalPrice: 10000
    },
    {
      id: 10,
      name: 'Pack Cumpleaños',
      price: 25000,
      category: 'ofertas',
      image: '/images/pack-cumpleanos.jpg',
      description: 'Torta mediana + 12 cupcakes + velas',
      featured: false,
      originalPrice: 30000
    }
  ])

  const categories = ref([
    { id: 'todas', name: 'Todas', icon: '🍰' },
    { id: 'tortas', name: 'Tortas', icon: '🎂' },
    { id: 'panaderia', name: 'Panadería', icon: '🥖' },
    { id: 'sin-azucar', name: 'Sin Azúcar', icon: '🌿' },
    { id: 'ofertas', name: 'Ofertas', icon: '🏷️' }
  ])

  const selectedCategory = ref('todas')
  const searchQuery = ref('')

  // Getters
  const featuredProducts = computed(() => {
    return products.value.filter(product => product.featured)
  })

  const filteredProducts = computed(() => {
    let filtered = products.value

    // Filter by category
    if (selectedCategory.value !== 'todas') {
      filtered = filtered.filter(product => product.category === selectedCategory.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  const getProductById = computed(() => {
    return (id) => products.value.find(product => product.id === id)
  })

  // Actions
  function setCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function clearFilters() {
    selectedCategory.value = 'todas'
    searchQuery.value = ''
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  return {
    // State
    products,
    categories,
    selectedCategory,
    searchQuery,
    // Getters
    featuredProducts,
    filteredProducts,
    getProductById,
    // Actions
    setCategory,
    setSearchQuery,
    clearFilters,
    formatPrice
  }
})
