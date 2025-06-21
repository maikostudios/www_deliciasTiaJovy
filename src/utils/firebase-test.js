// Utilidades para probar la conexión con Firebase
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/main.js'

// Función para probar la autenticación
export async function testAuth() {
  try {
    console.log('🔐 Probando autenticación...')
    
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      'deliciastiajovy@gmail.com', 
      '123456'
    )
    
    console.log('✅ Autenticación exitosa:', userCredential.user.email)
    
    // Cerrar sesión después de la prueba
    await signOut(auth)
    console.log('✅ Sesión cerrada correctamente')
    
    return { success: true, message: 'Autenticación funcionando correctamente' }
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message)
    return { success: false, error: error.message }
  }
}

// Función para probar Firestore
export async function testFirestore() {
  try {
    console.log('🗄️ Probando Firestore...')
    
    // Crear un documento de prueba
    const testData = {
      test: true,
      timestamp: new Date(),
      message: 'Prueba de conexión desde Delicias Tía Jovy'
    }
    
    const docRef = await addDoc(collection(db, 'test'), testData)
    console.log('✅ Documento creado con ID:', docRef.id)
    
    // Leer documentos de prueba
    const querySnapshot = await getDocs(collection(db, 'test'))
    console.log('✅ Documentos encontrados:', querySnapshot.size)
    
    return { success: true, message: 'Firestore funcionando correctamente' }
  } catch (error) {
    console.error('❌ Error en Firestore:', error.message)
    return { success: false, error: error.message }
  }
}

// Función para inicializar datos de ejemplo en Firestore
export async function initializeSampleData() {
  try {
    console.log('📦 Inicializando datos de ejemplo...')
    
    // Productos de ejemplo
    const sampleProducts = [
      {
        id: 'torta-chocolate',
        name: 'Torta de Chocolate Premium',
        price: 18000,
        category: 'tortas',
        description: 'Deliciosa torta de chocolate con tres capas, relleno de manjar y cobertura de chocolate belga',
        featured: true,
        available: true,
        createdAt: new Date()
      },
      {
        id: 'pan-amasado',
        name: 'Pan Amasado Casero',
        price: 1800,
        category: 'panaderia',
        description: 'Pan amasado tradicional chileno, recién horneado cada mañana',
        featured: true,
        available: true,
        createdAt: new Date()
      },
      {
        id: 'torta-sin-azucar',
        name: 'Torta Sin Azúcar con Stevia',
        price: 22000,
        category: 'sin-azucar',
        description: 'Torta especial endulzada con stevia natural, ideal para diabéticos',
        featured: true,
        available: true,
        createdAt: new Date()
      }
    ]
    
    // Agregar productos a Firestore
    for (const product of sampleProducts) {
      await setDoc(doc(db, 'products', product.id), product)
      console.log(`✅ Producto agregado: ${product.name}`)
    }
    
    // Configuración del negocio
    const businessInfo = {
      name: 'Delicias Tía Jovy',
      email: 'deliciastiajovy@gmail.com',
      phone: '+56 9 1234 5678',
      address: 'Nueva Imperial, Chile',
      hours: {
        monday: '8:00 - 20:00',
        tuesday: '8:00 - 20:00',
        wednesday: '8:00 - 20:00',
        thursday: '8:00 - 20:00',
        friday: '8:00 - 20:00',
        saturday: '8:00 - 18:00',
        sunday: 'Cerrado'
      },
      updatedAt: new Date()
    }
    
    await setDoc(doc(db, 'config', 'business'), businessInfo)
    console.log('✅ Información del negocio agregada')
    
    return { success: true, message: 'Datos de ejemplo inicializados correctamente' }
  } catch (error) {
    console.error('❌ Error inicializando datos:', error.message)
    return { success: false, error: error.message }
  }
}

// Función para probar todo el sistema
export async function runAllTests() {
  console.log('🚀 Iniciando pruebas de Firebase...')
  
  const authResult = await testAuth()
  const firestoreResult = await testFirestore()
  
  console.log('\n📊 Resultados de las pruebas:')
  console.log('Auth:', authResult.success ? '✅' : '❌', authResult.message || authResult.error)
  console.log('Firestore:', firestoreResult.success ? '✅' : '❌', firestoreResult.message || firestoreResult.error)
  
  if (authResult.success && firestoreResult.success) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! Firebase está configurado correctamente.')
    return true
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisa la configuración de Firebase.')
    return false
  }
}
