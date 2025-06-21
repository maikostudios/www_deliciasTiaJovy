// Test script para verificar el store de productos
console.log('🧪 Testing Products Store...')

// Simular el comportamiento del store
const testProducts = [
  {
    id: 'test-1',
    name: 'Test Product',
    active: true,
    featured: true,
    productType: 'simple'
  },
  {
    id: 'test-2', 
    name: 'Test Product 2',
    active: undefined,
    featured: true,
    productType: 'configurable'
  }
]

// Test filteredProducts logic
const filteredProducts = testProducts.filter(product => product.active !== false)
console.log('Filtered Products:', filteredProducts.length)

// Test featuredProducts logic  
const featuredProducts = testProducts.filter(product => product.featured && product.active !== false)
console.log('Featured Products:', featuredProducts.length)

console.log('✅ Store logic test completed')
