// Debug script para verificar los rellenos disponibles
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

// Simular la configuración del store
const storeFillings = [
  { id: 'pina-crema-pina', name: 'Piña crema piña', category: 'frutal' },
  { id: 'pina-crema-manjar', name: 'Piña crema manjar', category: 'frutal' },
  { id: 'pina-crema-durazno', name: 'Piña crema durazno', category: 'frutal' },
  { id: 'pina-crema-frutilla', name: 'Piña crema frutilla', category: 'frutal' },
  { id: 'durazno-crema-durazno', name: 'Durazno crema durazno', category: 'frutal' },
  { id: 'durazno-crema-manjar', name: 'Durazno crema manjar', category: 'frutal' },
  { id: 'durazno-crema-frutilla', name: 'Durazno crema frutilla', category: 'frutal' },
  { id: 'moca-tradicional', name: 'Moca tradicional pura crema', category: 'chocolate' },
  { id: 'moca-durazno-manjar', name: 'Moca durazno manjar', category: 'chocolate' },
  { id: 'frutilla-crema-frutilla', name: 'Frutilla crema frutilla', category: 'frutal' },
  { id: 'frutilla-crema-manjar', name: 'Frutilla crema manjar', category: 'frutal' },
  { id: 'selva-negra', name: 'Selva negra mermelada de ciruela crema manjar', category: 'chocolate' },
  { id: 'frambuesa-crema-manjar', name: 'Frambuesa crema manjar', category: 'frutal' },
  { id: 'frambuesa-crema-frambuesa', name: 'Frambuesa crema frambuesa', category: 'frutal' }
]

async function debugFillings() {
  try {
    console.log('🔍 Debug de rellenos disponibles...')
    
    const querySnapshot = await getDocs(collection(db, 'products'))
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      
      if (data.productType === 'configurable') {
        console.log(`\n🎂 PRODUCTO: ${data.name}`)
        console.log(`   ID: ${doc.id}`)
        
        if (data.cakeConfig) {
          console.log(`   Rellenos en producto: ${JSON.stringify(data.cakeConfig.fillings)}`)
          
          // Simular la lógica del componente
          const productFillings = data.cakeConfig.fillings || []
          console.log(`   Rellenos del producto (${productFillings.length}):`, productFillings)
          
          // Filtrar rellenos disponibles
          let availableFillings = []
          if (productFillings.length === 0) {
            availableFillings = storeFillings
            console.log(`   ✅ Sin configuración específica, usando todos los rellenos (${availableFillings.length})`)
          } else {
            availableFillings = storeFillings.filter(filling => productFillings.includes(filling.id))
            console.log(`   ✅ Filtrando rellenos específicos (${availableFillings.length}):`)
          }
          
          // Agrupar por categoría
          const frutalFillings = availableFillings.filter(f => f.category === 'frutal')
          const chocolateFillings = availableFillings.filter(f => f.category === 'chocolate')
          
          console.log(`\n   🍓 RELLENOS FRUTALES (${frutalFillings.length}):`)
          frutalFillings.forEach(f => console.log(`      - ${f.name}`))
          
          console.log(`\n   🍫 RELLENOS DE CHOCOLATE (${chocolateFillings.length}):`)
          chocolateFillings.forEach(f => console.log(`      - ${f.name}`))
          
          if (frutalFillings.length === 0 && chocolateFillings.length === 0) {
            console.log(`   ❌ NO HAY RELLENOS DISPONIBLES - Este es el problema!`)
            
            // Verificar qué está pasando
            console.log(`   🔍 Análisis detallado:`)
            console.log(`      - Rellenos en store: ${storeFillings.length}`)
            console.log(`      - Rellenos en producto: ${productFillings.length}`)
            console.log(`      - Rellenos filtrados: ${availableFillings.length}`)
            
            if (productFillings.length > 0) {
              console.log(`   🔍 Verificando coincidencias:`)
              productFillings.forEach(pf => {
                const found = storeFillings.find(sf => sf.id === pf)
                console.log(`      - "${pf}": ${found ? 'ENCONTRADO' : 'NO ENCONTRADO'}`)
              })
            }
          }
        } else {
          console.log(`   ❌ NO HAY CAKECONFIG`)
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Error en debug de rellenos:', error)
  }
}

debugFillings()
