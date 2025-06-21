<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 Pruebas de Firebase</h3>
    
    <div class="space-y-4">
      <!-- Test Buttons -->
      <div class="flex flex-wrap gap-3">
        <button
          @click="testAuth"
          :disabled="loading"
          class="btn-primary text-sm"
        >
          🔐 Probar Auth
        </button>
        <button
          @click="testFirestore"
          :disabled="loading"
          class="btn-secondary text-sm"
        >
          🗄️ Probar Firestore
        </button>
        <button
          @click="initializeData"
          :disabled="loading"
          class="btn-accent text-sm"
        >
          📦 Inicializar Datos
        </button>
        <button
          @click="runAllTests"
          :disabled="loading"
          class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
        >
          🚀 Probar Todo
        </button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex items-center space-x-2 text-blue-600">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span class="text-sm">Ejecutando prueba...</span>
      </div>

      <!-- Results -->
      <div v-if="results.length > 0" class="space-y-2">
        <h4 class="font-medium text-gray-900">Resultados:</h4>
        <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
          <div
            v-for="(result, index) in results"
            :key="index"
            :class="[
              'text-sm mb-2 p-2 rounded',
              result.type === 'success' ? 'bg-green-100 text-green-800' :
              result.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            ]"
          >
            <span class="font-mono">{{ result.timestamp }}</span> - {{ result.message }}
          </div>
        </div>
        <button
          @click="clearResults"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Limpiar resultados
        </button>
      </div>

      <!-- Firebase Status -->
      <div class="border-t pt-4">
        <h4 class="font-medium text-gray-900 mb-2">Estado de Firebase:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-3 h-3 rounded-full',
              authStatus === 'connected' ? 'bg-green-500' :
              authStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            ]"></div>
            <span class="text-sm">
              Authentication: {{ authStatus === 'connected' ? 'Conectado' : 
                                authStatus === 'error' ? 'Error' : 'Desconocido' }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-3 h-3 rounded-full',
              firestoreStatus === 'connected' ? 'bg-green-500' :
              firestoreStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            ]"></div>
            <span class="text-sm">
              Firestore: {{ firestoreStatus === 'connected' ? 'Conectado' : 
                           firestoreStatus === 'error' ? 'Error' : 'Desconocido' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Configuration Info -->
      <div class="border-t pt-4">
        <h4 class="font-medium text-gray-900 mb-2">Configuración:</h4>
        <div class="text-sm text-gray-600 space-y-1">
          <div>Project ID: <code class="bg-gray-100 px-1 rounded">deliciastiajovy-6cd88</code></div>
          <div>Auth Domain: <code class="bg-gray-100 px-1 rounded">deliciastiajovy-6cd88.firebaseapp.com</code></div>
          <div>Admin Email: <code class="bg-gray-100 px-1 rounded">deliciastiajovy@gmail.com</code></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  testAuth as testAuthFunction, 
  testFirestore as testFirestoreFunction, 
  initializeSampleData, 
  runAllTests as runAllTestsFunction 
} from '@/utils/firebase-test.js'

const loading = ref(false)
const results = ref([])
const authStatus = ref('unknown')
const firestoreStatus = ref('unknown')

const addResult = (message, type = 'info') => {
  results.value.unshift({
    message,
    type,
    timestamp: new Date().toLocaleTimeString()
  })
}

const testAuth = async () => {
  loading.value = true
  addResult('Probando autenticación...', 'info')
  
  try {
    const result = await testAuthFunction()
    if (result.success) {
      authStatus.value = 'connected'
      addResult('✅ Autenticación exitosa', 'success')
    } else {
      authStatus.value = 'error'
      addResult(`❌ Error en autenticación: ${result.error}`, 'error')
    }
  } catch (error) {
    authStatus.value = 'error'
    addResult(`❌ Error inesperado: ${error.message}`, 'error')
  }
  
  loading.value = false
}

const testFirestore = async () => {
  loading.value = true
  addResult('Probando Firestore...', 'info')
  
  try {
    const result = await testFirestoreFunction()
    if (result.success) {
      firestoreStatus.value = 'connected'
      addResult('✅ Firestore funcionando correctamente', 'success')
    } else {
      firestoreStatus.value = 'error'
      addResult(`❌ Error en Firestore: ${result.error}`, 'error')
    }
  } catch (error) {
    firestoreStatus.value = 'error'
    addResult(`❌ Error inesperado: ${error.message}`, 'error')
  }
  
  loading.value = false
}

const initializeData = async () => {
  loading.value = true
  addResult('Inicializando datos de ejemplo...', 'info')
  
  try {
    const result = await initializeSampleData()
    if (result.success) {
      addResult('✅ Datos de ejemplo inicializados', 'success')
    } else {
      addResult(`❌ Error inicializando datos: ${result.error}`, 'error')
    }
  } catch (error) {
    addResult(`❌ Error inesperado: ${error.message}`, 'error')
  }
  
  loading.value = false
}

const runAllTests = async () => {
  loading.value = true
  addResult('Ejecutando todas las pruebas...', 'info')
  
  try {
    const success = await runAllTestsFunction()
    if (success) {
      authStatus.value = 'connected'
      firestoreStatus.value = 'connected'
      addResult('🎉 ¡Todas las pruebas pasaron!', 'success')
    } else {
      addResult('⚠️ Algunas pruebas fallaron', 'error')
    }
  } catch (error) {
    addResult(`❌ Error ejecutando pruebas: ${error.message}`, 'error')
  }
  
  loading.value = false
}

const clearResults = () => {
  results.value = []
}

onMounted(() => {
  addResult('Componente de pruebas cargado', 'info')
})
</script>
