// Debug script para verificar productos en Firebase
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

async function debugProducts() {
  try {
    console.log('🔍 Verificando productos en Firebase...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    console.log(`📊 Total documentos encontrados: ${querySnapshot.size}`)
    
    if (querySnapshot.empty) {
      console.log('❌ No hay productos en la base de datos')
      return
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(`\n📦 Producto ID: ${doc.id}`)
      console.log(`   Nombre: ${data.name}`)
      console.log(`   Precio: $${data.price}`)
      console.log(`   Categoría: ${data.category}`)
      console.log(`   Activo: ${data.active}`)
      console.log(`   Featured: ${data.featured}`)
      console.log(`   ProductType: ${data.productType}`)
      console.log(`   ImageUrl: ${data.imageUrl}`)
    })
    
  } catch (error) {
    console.error('❌ Error al verificar productos:', error)
  }
}

debugProducts()
