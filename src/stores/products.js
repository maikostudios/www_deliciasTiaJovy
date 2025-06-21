import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { db } from '@/main.js'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref('all')
  const searchQuery = ref('')

  // Categories
  const categories = computed(() => [
    { id: 'all', name: 'Todos', icon: '🍽️' },
    { id: 'tortas', name: 'Tortas', icon: '🎂' },
    { id: 'panaderia', name: 'Panadería', icon: '🥖' },
    { id: 'sin-azucar', name: 'Sin Azúcar', icon: '🌿' },
    { id: 'ofertas', name: 'Ofertas', icon: '🏷️' }
  ])

  // Getters
  const featuredProducts = computed(() => {
    return products.value.filter(product => product.featured && product.active)
  })

  const filteredProducts = computed(() => {
    let filtered = products.value.filter(product => product.active)

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory.value)
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  // Actions
  async function fetchProducts() {
    try {
      loading.value = true
      error.value = null

      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      products.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching products:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function addProduct(productData) {
    try {
      loading.value = true
      error.value = null

      const newProduct = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: productData.active !== undefined ? productData.active : true
      }

      const docRef = await addDoc(collection(db, 'products'), newProduct)
      
      // Add to local state
      products.value.unshift({
        id: docRef.id,
        ...newProduct
      })

      return { success: true, productId: docRef.id }
    } catch (err) {
      error.value = err.message
      console.error('Error adding product:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(productId, productData) {
    try {
      loading.value = true
      error.value = null

      const updatedProduct = {
        ...productData,
        updatedAt: new Date()
      }

      await updateDoc(doc(db, 'products', productId), updatedProduct)
      
      // Update local state
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = { id: productId, ...updatedProduct }
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error updating product:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(productId) {
    try {
      loading.value = true
      error.value = null

      await deleteDoc(doc(db, 'products', productId))
      
      // Remove from local state
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value.splice(index, 1)
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting product:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  function setCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function clearFilters() {
    selectedCategory.value = 'all'
    searchQuery.value = ''
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  function getProductById(id) {
    return products.value.find(product => product.id === id)
  }

  function getProductImageUrl(product, size = 'medium') {
    if (product.imageUrl) {
      return product.imageUrl
    }
    // Fallback to placeholder or category emoji
    return null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    products,
    loading,
    error,
    selectedCategory,
    searchQuery,
    // Getters
    categories,
    featuredProducts,
    filteredProducts,
    // Actions
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setCategory,
    setSearchQuery,
    clearFilters,
    formatPrice,
    getProductById,
    getProductImageUrl,
    clearError
  }
})
