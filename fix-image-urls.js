// Script para corregir URLs de imágenes con las que realmente existen
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

// Mapeo de productos a imágenes reales disponibles
const imageMapping = {
  'Torta de Chocolate': 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Tortas/torta_dragonball.jpg',
  'Torta de Frutilla': 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Tortas/torta_de_la_pendeja_y_el_oso.jpg',
  'Pan Amasado': 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Postres/mini_tarta_con_almendras.jpg',
  'Empanadas de Pino': 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Postres/tarta_de_manzana_con_frutos_rojos.jpg',
  'Torta Sin Azúcar': 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Postres/casa_de_jengibre.jpg',
  'Combo Desayuno': 'https://raw.githubusercontent.com/maikostudios/assets_delicias_tia_jovy/main/assets/img/productos/Postres/tarta_de_kiwi_con_mandarina.jpg'
}

async function fixImageUrls() {
  try {
    console.log('🖼️ Corrigiendo URLs de imágenes...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    console.log(`📊 Total productos a verificar: ${querySnapshot.size}`)
    
    const updates = []
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const productId = docSnapshot.id
      const productName = data.name
      
      // Verificar si necesita actualización de imagen
      if (imageMapping[productName]) {
        const newImageUrl = imageMapping[productName]
        if (data.imageUrl !== newImageUrl) {
          updates.push({
            id: productId,
            name: productName,
            oldUrl: data.imageUrl,
            newUrl: newImageUrl
          })
        }
      }
    })
    
    console.log(`🔄 Actualizando ${updates.length} URLs de imágenes...`)
    
    for (const update of updates) {
      await updateDoc(doc(db, 'products', update.id), {
        imageUrl: update.newUrl,
        updatedAt: new Date()
      })
      console.log(`✅ Actualizado: ${update.name}`)
      console.log(`   - Antes: ${update.oldUrl}`)
      console.log(`   - Ahora: ${update.newUrl}`)
    }
    
    console.log('🎉 URLs de imágenes corregidas!')
    
    // Verificar que las nuevas URLs funcionen
    console.log('\n🧪 Verificando nuevas URLs...')
    for (const [productName, imageUrl] of Object.entries(imageMapping)) {
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' })
        if (response.ok) {
          console.log(`✅ ${productName}: URL válida`)
        } else {
          console.log(`❌ ${productName}: URL inválida (${response.status})`)
        }
      } catch (error) {
        console.log(`❌ ${productName}: Error al verificar URL`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error al corregir URLs de imágenes:', error)
  }
}

fixImageUrls()
