// Script para corregir productos existentes en Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNf_WVQHbzxpHMykyTkBAmC_c2hZO9P3Y",
  authDomain: "deliciastiajovy-6cd88.firebaseapp.com",
  projectId: "deliciastiajovy-6cd88",
  storageBucket: "deliciastiajovy-6cd88.firebasestorage.app",
  messagingSenderId: "452372178228",
  appId: "1:452372178228:web:a04c666848f1b8f722b161"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function fixProducts() {
  try {
    console.log('🔧 Corrigiendo productos en Firebase...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    console.log(`📊 Total productos a corregir: ${querySnapshot.size}`)
    
    const updates = []
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const productId = docSnapshot.id
      
      // Determinar actualizaciones necesarias
      const updateData = {}
      
      // Corregir campo active
      if (data.active === undefined) {
        updateData.active = true
      }
      
      // Corregir productType basado en categoría y nombre
      if (data.productType === undefined) {
        if (data.category === 'tortas' || data.name.toLowerCase().includes('torta')) {
          updateData.productType = 'configurable'
          updateData.customizable = true
        } else {
          updateData.productType = 'simple'
          updateData.customizable = false
        }
      }
      
      // Agregar imageUrl basado en el producto
      if (data.imageUrl === undefined) {
        const baseUrl = 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos'
        
        if (productId === 'torta-chocolate') {
          updateData.imageUrl = `${baseUrl}/Tortas/torta_chocolate.jpg`
        } else if (productId === 'torta-sin-azucar') {
          updateData.imageUrl = `${baseUrl}/Postres/torta_sin_azucar.jpg`
        } else if (productId === 'pan-amasado') {
          updateData.imageUrl = `${baseUrl}/Panes/pan_amasado.jpg`
        }
      }
      
      // Agregar configuración de torta si es necesario
      if (updateData.productType === 'configurable' && !data.cakeConfig) {
        updateData.cakeConfig = {
          availableSizes: [10, 15, 20, 25, 30, 35, 40],
          availableFillings: ['chocolate', 'manjar', 'frutilla', 'durazno'],
          availableExtras: ['lamina-chocolate', 'nueces', 'tercer-relleno']
        }
      }
      
      if (Object.keys(updateData).length > 0) {
        updates.push({ id: productId, data: updateData, name: data.name })
      }
    })
    
    console.log(`🔄 Actualizando ${updates.length} productos...`)
    
    for (const update of updates) {
      await updateDoc(doc(db, 'products', update.id), update.data)
      console.log(`✅ Actualizado: ${update.name}`)
      console.log(`   - Campos: ${Object.keys(update.data).join(', ')}`)
    }
    
    console.log('🎉 Todos los productos han sido corregidos!')
    
  } catch (error) {
    console.error('❌ Error al corregir productos:', error)
  }
}

fixProducts()
