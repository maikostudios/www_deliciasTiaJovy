/**
 * Initialize sample data for Delicias Tía Jovy
 * This script adds sample products to Firebase Firestore
 */

import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/main.js'

// Sample products data
const sampleProducts = [
  {
    name: 'Torta de Chocolate',
    description: 'Deliciosa torta de chocolate con relleno de manjar y cobertura de chocolate',
    price: 15000,
    originalPrice: null,
    category: 'tortas',
    imageUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Tortas/torta_chocolate.jpg',
    featured: true,
    active: true,
    customizable: true,
    cakeConfig: {
      availableSizes: [10, 15, 20, 25, 30, 35, 40],
      availableFillings: ['chocolate', 'manjar', 'frutilla', 'durazno'],
      availableExtras: ['lamina-chocolate', 'nueces', 'tercer-relleno']
    }
  },
  {
    name: 'Torta de Frutilla',
    description: 'Torta esponjosa con crema y frutillas frescas, perfecta para cualquier ocasión',
    price: 18000,
    originalPrice: null,
    category: 'tortas',
    imageUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Tortas/torta_frutilla.jpg',
    featured: true,
    active: true,
    customizable: true,
    cakeConfig: {
      availableSizes: [10, 15, 20, 25, 30, 35, 40],
      availableFillings: ['frutilla', 'crema-chantilly', 'manjar'],
      availableExtras: ['lamina-blanca', 'topper-personalizado']
    }
  },
  {
    name: 'Pan Amasado',
    description: 'Pan amasado tradicional, recién horneado todos los días',
    price: 1500,
    originalPrice: null,
    category: 'panaderia',
    imageUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Panes/pan_amasado.jpg',
    featured: true,
    active: true,
    customizable: false
  },
  {
    name: 'Empanadas de Pino',
    description: 'Empanadas caseras de pino con huevo y aceituna, masa crujiente',
    price: 2500,
    originalPrice: null,
    category: 'panaderia',
    imageUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Salados/empanadas.jpg',
    featured: false,
    active: true,
    customizable: false
  },
  {
    name: 'Torta Sin Azúcar',
    description: 'Torta especial endulzada con stevia, ideal para diabéticos',
    price: 20000,
    originalPrice: null,
    category: 'sin-azucar',
    imageUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Postres/torta_sin_azucar.jpg',
    featured: true,
    active: true,
    customizable: false
  },
  {
    name: 'Combo Desayuno',
    description: 'Pan amasado + mermelada + mantequilla + té o café',
    price: 8000,
    originalPrice: 10000,
    category: 'ofertas',
    imageUrl: 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Combos/combo_desayuno.jpg',
    featured: true,
    active: true,
    customizable: false
  }
]

/**
 * Clear all existing products
 */
export async function clearProducts() {
  try {
    console.log('🗑️ Clearing existing products...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'products', docSnapshot.id))
    )
    
    await Promise.all(deletePromises)
    console.log(`✅ Cleared ${deletePromises.length} existing products`)
    
    return { success: true, count: deletePromises.length }
  } catch (error) {
    console.error('❌ Error clearing products:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Add sample products to Firebase
 */
export async function addSampleProducts() {
  try {
    console.log('📦 Adding sample products...')
    
    const addPromises = sampleProducts.map(async (product) => {
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'products'), productData)
      console.log(`✅ Added product: ${product.name} (${docRef.id})`)
      
      return { id: docRef.id, ...productData }
    })
    
    const results = await Promise.all(addPromises)
    console.log(`🎉 Successfully added ${results.length} sample products`)
    
    return { success: true, products: results }
  } catch (error) {
    console.error('❌ Error adding sample products:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Initialize complete sample data (clear + add)
 */
export async function initializeSampleData() {
  try {
    console.log('🚀 Initializing sample data for Delicias Tía Jovy...')
    
    // Clear existing data
    const clearResult = await clearProducts()
    if (!clearResult.success) {
      throw new Error(`Failed to clear products: ${clearResult.error}`)
    }
    
    // Add sample products
    const addResult = await addSampleProducts()
    if (!addResult.success) {
      throw new Error(`Failed to add products: ${addResult.error}`)
    }
    
    console.log('🎉 Sample data initialization completed successfully!')
    
    return {
      success: true,
      message: `Initialized ${addResult.products.length} sample products`,
      products: addResult.products
    }
  } catch (error) {
    console.error('❌ Error initializing sample data:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if products exist in Firebase
 */
export async function checkProductsExist() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'))
    const count = querySnapshot.size
    
    console.log(`📊 Found ${count} products in Firebase`)
    
    return { success: true, count, exists: count > 0 }
  } catch (error) {
    console.error('❌ Error checking products:', error)
    return { success: false, error: error.message }
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.DeliciasTiaJovy = {
    initializeSampleData,
    addSampleProducts,
    clearProducts,
    checkProductsExist
  }
  
  console.log('🧁 Delicias Tía Jovy utilities loaded!')
  console.log('Use window.DeliciasTiaJovy.initializeSampleData() to initialize sample data')
}
