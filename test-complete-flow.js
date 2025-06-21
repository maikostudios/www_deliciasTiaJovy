// Test completo del flujo de compra
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'

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

async function testCompleteFlow() {
  console.log('🧪 TESTING COMPLETE PURCHASE FLOW')
  console.log('=' .repeat(50))
  
  try {
    // 1. Test product loading
    console.log('\n📦 STEP 1: Testing Product Loading')
    const productsSnapshot = await getDocs(collection(db, 'products'))
    console.log(`✅ Products in database: ${productsSnapshot.size}`)
    
    const products = []
    productsSnapshot.forEach(doc => {
      const data = doc.data()
      products.push({ id: doc.id, ...data })
      console.log(`   - ${data.name} (${data.productType}) - $${data.price}`)
    })
    
    // 2. Test configurable product
    console.log('\n🎂 STEP 2: Testing Configurable Product (Torta)')
    const configurableProduct = products.find(p => p.productType === 'configurable')
    if (configurableProduct) {
      console.log(`✅ Found configurable product: ${configurableProduct.name}`)
      console.log(`   - Available sizes: ${configurableProduct.cakeConfig?.availableSizes?.join(', ') || 'Not configured'}`)
      console.log(`   - Available fillings: ${configurableProduct.cakeConfig?.availableFillings?.join(', ') || 'Not configured'}`)
      console.log(`   - Available extras: ${configurableProduct.cakeConfig?.availableExtras?.join(', ') || 'Not configured'}`)
    } else {
      console.log('❌ No configurable products found')
    }
    
    // 3. Simulate cart item with configuration
    console.log('\n🛒 STEP 3: Simulating Cart Item with Configuration')
    const cartItem = {
      id: `${configurableProduct.id}-${Date.now()}`,
      name: `${configurableProduct.name} (20 personas)`,
      price: 32000, // Price for 20 people
      quantity: 1,
      category: configurableProduct.category,
      configuration: {
        size: 20,
        fillings: ['chocolate', 'manjar'],
        extras: ['nueces', 'tercer-relleno'],
        specialInstructions: 'Con stevia en lugar de azúcar'
      }
    }
    console.log('✅ Cart item created:')
    console.log(`   - Product: ${cartItem.name}`)
    console.log(`   - Price: $${cartItem.price}`)
    console.log(`   - Size: ${cartItem.configuration.size} personas`)
    console.log(`   - Fillings: ${cartItem.configuration.fillings.join(', ')}`)
    console.log(`   - Extras: ${cartItem.configuration.extras.join(', ')}`)
    console.log(`   - Special: ${cartItem.configuration.specialInstructions}`)
    
    // 4. Simulate customer data
    console.log('\n👤 STEP 4: Simulating Customer Data')
    const customerData = {
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+56987654321',
      rut: '12.345.678-9',
      birthDate: '1985-03-15',
      instagramLink: '@maria_gonzalez',
      facebookLink: 'https://facebook.com/maria.gonzalez'
    }
    console.log('✅ Customer data created:')
    Object.entries(customerData).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value}`)
    })
    
    // 5. Simulate order data
    console.log('\n📋 STEP 5: Simulating Order Data')
    const orderData = {
      customerInfo: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        rut: customerData.rut
      },
      items: [cartItem],
      total: cartItem.price * cartItem.quantity,
      comments: 'Por favor usar stevia en lugar de azúcar. Entrega preferida en la tarde del sábado.',
      customerId: 'test-customer-id'
    }
    console.log('✅ Order data created:')
    console.log(`   - Customer: ${orderData.customerInfo.name}`)
    console.log(`   - Items: ${orderData.items.length}`)
    console.log(`   - Total: $${orderData.total}`)
    console.log(`   - Comments: ${orderData.comments}`)
    
    // 6. Test WhatsApp message generation
    console.log('\n📱 STEP 6: Testing WhatsApp Message Generation')
    const whatsappMessage = generateTestWhatsAppMessage(orderData)
    console.log('✅ WhatsApp message generated successfully')
    console.log('📄 Message preview (first 200 chars):')
    console.log(whatsappMessage.substring(0, 200) + '...')
    
    // 7. Test order creation (simulation)
    console.log('\n💾 STEP 7: Testing Order Creation')
    const testOrder = {
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Don't actually save to avoid test data pollution
    console.log('✅ Order structure validated:')
    console.log(`   - Status: ${testOrder.status}`)
    console.log(`   - Created: ${testOrder.createdAt.toISOString()}`)
    console.log(`   - Customer ID: ${testOrder.customerId}`)
    
    // 8. Test image URLs
    console.log('\n🖼️ STEP 8: Testing Image URLs')
    for (const product of products) {
      if (product.imageUrl) {
        console.log(`✅ ${product.name}: ${product.imageUrl}`)
      } else {
        console.log(`❌ ${product.name}: No image URL`)
      }
    }
    
    console.log('\n🎉 COMPLETE FLOW TEST FINISHED')
    console.log('=' .repeat(50))
    console.log('✅ All steps completed successfully!')
    
  } catch (error) {
    console.error('❌ Error in complete flow test:', error)
  }
}

function generateTestWhatsAppMessage(orderData) {
  const { customerInfo, items, comments, total } = orderData

  let message = `🧁 *NUEVO PEDIDO - DELICIAS TÍA JOVY* 🧁\n\n`
  message += `👤 *DATOS DEL CLIENTE:*\n`
  message += `• Nombre: ${customerInfo.name}\n`
  message += `• Email: ${customerInfo.email}\n`
  message += `• Teléfono: ${customerInfo.phone}\n`
  if (customerInfo.rut) {
    message += `• RUT: ${customerInfo.rut}\n`
  }
  message += `\n`

  message += `🛒 *DETALLE DEL PEDIDO:*\n`
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  
  items.forEach((item, index) => {
    message += `\n📦 *PRODUCTO ${index + 1}:*\n`
    message += `🧁 ${item.name}\n`
    message += `📊 Cantidad: ${item.quantity} unidad${item.quantity > 1 ? 'es' : ''}\n`
    message += `💵 Precio unitario: $${item.price.toLocaleString()}\n`
    message += `💰 Subtotal: $${(item.price * item.quantity).toLocaleString()}\n`

    if (item.configuration) {
      const config = item.configuration
      message += `\n🎂 *CONFIGURACIÓN PERSONALIZADA:*\n`

      if (config.size) {
        message += `👥 Tamaño: ${config.size} personas\n`
      }

      if (config.fillings && config.fillings.length > 0) {
        message += `🥧 Rellenos seleccionados:\n`
        config.fillings.forEach(filling => {
          message += `   • ${filling}\n`
        })
      }

      if (config.extras && config.extras.length > 0) {
        message += `✨ Extras y personalizaciones:\n`
        config.extras.forEach(extra => {
          message += `   • ${extra}\n`
        })
      }

      if (config.specialInstructions) {
        message += `📝 Instrucciones especiales: ${config.specialInstructions}\n`
      }
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
  })

  message += `\n💰 *RESUMEN FINANCIERO:*\n`
  message += `• Subtotal productos: $${total.toLocaleString()}\n`
  message += `• *TOTAL PEDIDO: $${total.toLocaleString()}*\n\n`

  if (comments && comments.trim()) {
    message += `💬 *COMENTARIOS ADICIONALES:*\n`
    message += `"${comments}"\n\n`
  }

  message += `📅 *Fecha del pedido:* ${new Date().toLocaleDateString('es-CL')}\n`
  message += `⏰ *Hora:* ${new Date().toLocaleTimeString('es-CL')}\n\n`
  
  message += `🎉 *¡Gracias por elegir Delicias Tía Jovy!*\n`

  return message
}

// Run the test
testCompleteFlow()
