// Script para corregir la estructura de cakeConfig
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

async function fixCakeConfigStructure() {
  try {
    console.log('🔧 Corrigiendo estructura de cakeConfig...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    const updates = []
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const productId = docSnapshot.id
      
      // Solo procesar productos configurables con cakeConfig
      if (data.productType === 'configurable' && data.cakeConfig) {
        const config = data.cakeConfig
        
        // Verificar si necesita corrección
        if (config.availableSizes || config.availableFillings || config.availableExtras) {
          const correctedConfig = {
            sizes: config.availableSizes || config.sizes || [],
            fillings: config.availableFillings || config.fillings || [],
            extras: config.availableExtras || config.extras || []
          }
          
          updates.push({
            id: productId,
            name: data.name,
            oldConfig: config,
            newConfig: correctedConfig
          })
        }
      }
    })
    
    console.log(`🔄 Actualizando ${updates.length} productos...`)
    
    for (const update of updates) {
      await updateDoc(doc(db, 'products', update.id), {
        cakeConfig: update.newConfig,
        updatedAt: new Date()
      })
      
      console.log(`✅ Actualizado: ${update.name}`)
      console.log(`   - Sizes: ${update.newConfig.sizes.length} elementos`)
      console.log(`   - Fillings: ${update.newConfig.fillings.length} elementos`)
      console.log(`   - Extras: ${update.newConfig.extras.length} elementos`)
    }
    
    console.log('🎉 Estructura de cakeConfig corregida!')
    
  } catch (error) {
    console.error('❌ Error al corregir estructura:', error)
  }
}

fixCakeConfigStructure()
