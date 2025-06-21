// Script para corregir los IDs de rellenos en los productos
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

// Mapeo de IDs simples a IDs del store
const fillingMapping = {
  // IDs simples → IDs del store
  'frutilla': 'frutilla-crema-frutilla',
  'chocolate': 'moca-tradicional',
  'manjar': 'durazno-crema-manjar',
  'durazno': 'durazno-crema-durazno',
  'pina': 'pina-crema-pina',
  'frambuesa': 'frambuesa-crema-frambuesa',
  'crema-chantilly': 'frutilla-crema-manjar', // Mapear a algo similar
  
  // Para torta de chocolate - opciones variadas
  'chocolate-base': 'moca-tradicional',
  'chocolate-frutal': 'moca-durazno-manjar',
  'selva-negra': 'selva-negra'
}

// Configuraciones específicas por producto
const productFillingConfigs = {
  'Torta de Frutilla': [
    'frutilla-crema-frutilla',
    'frutilla-crema-manjar', 
    'frambuesa-crema-frambuesa',
    'durazno-crema-frutilla'
  ],
  'Torta de Chocolate': [
    'moca-tradicional',
    'moca-durazno-manjar',
    'selva-negra',
    'durazno-crema-manjar'
  ]
}

async function fixFillingIds() {
  try {
    console.log('🔧 Corrigiendo IDs de rellenos...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    const updates = []
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const productId = docSnapshot.id
      
      if (data.productType === 'configurable' && data.cakeConfig && data.cakeConfig.fillings) {
        const productName = data.name
        const currentFillings = data.cakeConfig.fillings
        
        console.log(`\n🎂 Procesando: ${productName}`)
        console.log(`   Rellenos actuales: ${JSON.stringify(currentFillings)}`)
        
        // Usar configuración específica del producto si existe
        let newFillings = productFillingConfigs[productName]
        
        if (!newFillings) {
          // Mapear IDs simples a IDs del store
          newFillings = currentFillings.map(filling => {
            return fillingMapping[filling] || filling
          }).filter(filling => filling) // Remover undefined
        }
        
        console.log(`   Rellenos nuevos: ${JSON.stringify(newFillings)}`)
        
        if (JSON.stringify(currentFillings) !== JSON.stringify(newFillings)) {
          updates.push({
            id: productId,
            name: productName,
            oldFillings: currentFillings,
            newFillings: newFillings
          })
        }
      }
    })
    
    console.log(`\n🔄 Actualizando ${updates.length} productos...`)
    
    for (const update of updates) {
      const newCakeConfig = {
        ...update.oldCakeConfig,
        fillings: update.newFillings
      }
      
      // Obtener la configuración actual completa
      const currentDoc = await getDocs(collection(db, 'products'))
      let currentCakeConfig = {}
      
      currentDoc.forEach(doc => {
        if (doc.id === update.id) {
          currentCakeConfig = doc.data().cakeConfig
        }
      })
      
      await updateDoc(doc(db, 'products', update.id), {
        cakeConfig: {
          ...currentCakeConfig,
          fillings: update.newFillings
        },
        updatedAt: new Date()
      })
      
      console.log(`✅ Actualizado: ${update.name}`)
      console.log(`   - Antes: ${JSON.stringify(update.oldFillings)}`)
      console.log(`   - Ahora: ${JSON.stringify(update.newFillings)}`)
    }
    
    console.log('\n🎉 IDs de rellenos corregidos!')
    
    // Verificar que ahora funcione
    console.log('\n🧪 Verificando corrección...')
    const verifySnapshot = await getDocs(collection(db, 'products'))
    
    verifySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.productType === 'configurable') {
        console.log(`\n✅ ${data.name}:`)
        console.log(`   Rellenos: ${JSON.stringify(data.cakeConfig.fillings)}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error al corregir IDs de rellenos:', error)
  }
}

fixFillingIds()
