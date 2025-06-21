// Debug script para verificar el producto específico que está causando el error
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

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

async function debugSpecificProduct() {
  try {
    console.log('🔍 Verificando producto específico que causa el error...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    console.log(`📊 Total documentos encontrados: ${querySnapshot.size}`)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      
      // Buscar el producto que está causando el error (ID: 7KLC5ftNDOgDbViWkHM4)
      if (doc.id === '7KLC5ftNDOgDbViWkHM4' || data.productType === 'configurable') {
        console.log(`\n🎂 PRODUCTO CONFIGURABLE: ${doc.id}`)
        console.log(`   Nombre: ${data.name}`)
        console.log(`   ProductType: ${data.productType}`)
        console.log(`   Customizable: ${data.customizable}`)
        console.log(`   CakeConfig existe: ${data.cakeConfig ? 'SÍ' : 'NO'}`)
        
        if (data.cakeConfig) {
          console.log(`   CakeConfig estructura:`)
          console.log(`     - sizes: ${JSON.stringify(data.cakeConfig.sizes)}`)
          console.log(`     - fillings: ${JSON.stringify(data.cakeConfig.fillings)}`)
          console.log(`     - extras: ${JSON.stringify(data.cakeConfig.extras)}`)
          console.log(`     - availableSizes: ${JSON.stringify(data.cakeConfig.availableSizes)}`)
          console.log(`     - availableFillings: ${JSON.stringify(data.cakeConfig.availableFillings)}`)
          console.log(`     - availableExtras: ${JSON.stringify(data.cakeConfig.availableExtras)}`)
        } else {
          console.log(`   ❌ NO HAY CAKECONFIG - Este es el problema!`)
        }
        
        console.log(`   Estructura completa:`)
        console.log(JSON.stringify(data, null, 2))
      }
    })
    
  } catch (error) {
    console.error('❌ Error al verificar producto específico:', error)
  }
}

debugSpecificProduct()
