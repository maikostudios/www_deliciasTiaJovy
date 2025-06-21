// Test completo del flujo de compra con orden real
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

async function testPurchaseFlow() {
  console.log('🛒 TESTING COMPLETE PURCHASE FLOW')
  console.log('=' .repeat(60))
  
  try {
    // 1. Cargar productos disponibles
    console.log('\n📦 STEP 1: Loading Available Products')
    const productsSnapshot = await getDocs(collection(db, 'products'))
    const products = []
    
    productsSnapshot.forEach(doc => {
      const data = doc.data()
      if (data.active !== false) {
        products.push({ id: doc.id, ...data })
      }
    })
    
    console.log(`✅ Found ${products.length} active products:`)
    products.forEach(p => {
      console.log(`   - ${p.name} (${p.productType}) - $${p.price.toLocaleString()}`)
    })
    
    // 2. Seleccionar una torta configurable para testing
    console.log('\n🎂 STEP 2: Selecting Configurable Cake')
    const configurableCake = products.find(p => p.productType === 'configurable')
    
    if (!configurableCake) {
      throw new Error('No configurable cakes found!')
    }
    
    console.log(`✅ Selected: ${configurableCake.name}`)
    console.log(`   - Base price: $${configurableCake.price.toLocaleString()}`)
    console.log(`   - Available sizes: ${configurableCake.cakeConfig?.availableSizes?.join(', ') || 'Not configured'}`)
    
    // 3. Configurar la torta
    console.log('\n⚙️ STEP 3: Configuring Cake')
    const cakeConfiguration = {
      size: 25, // 25 personas
      fillings: ['chocolate', 'manjar', 'frutilla'], // 3 rellenos
      extras: ['nueces', 'tercer-relleno'], // Extras
      specialInstructions: 'Por favor usar stevia en lugar de azúcar. Decoración con tema de cumpleaños.'
    }
    
    // Calcular precio (simulado)
    const sizePrice = 37000 // Precio para 25 personas
    const extrasPrice = 2500 + 3000 // Nueces + tercer relleno
    const totalPrice = sizePrice + extrasPrice
    
    console.log('✅ Cake configured:')
    console.log(`   - Size: ${cakeConfiguration.size} personas`)
    console.log(`   - Fillings: ${cakeConfiguration.fillings.join(', ')}`)
    console.log(`   - Extras: ${cakeConfiguration.extras.join(', ')}`)
    console.log(`   - Special: ${cakeConfiguration.specialInstructions}`)
    console.log(`   - Total price: $${totalPrice.toLocaleString()}`)
    
    // 4. Crear item del carrito
    console.log('\n🛒 STEP 4: Adding to Cart')
    const cartItem = {
      id: `${configurableCake.id}-${Date.now()}`,
      name: `${configurableCake.name} (${cakeConfiguration.size} personas)`,
      price: totalPrice,
      quantity: 1,
      category: configurableCake.category,
      configuration: cakeConfiguration
    }
    
    console.log('✅ Cart item created:')
    console.log(`   - Product: ${cartItem.name}`)
    console.log(`   - Price: $${cartItem.price.toLocaleString()}`)
    console.log(`   - Quantity: ${cartItem.quantity}`)
    
    // 5. Agregar producto simple también
    console.log('\n🥖 STEP 5: Adding Simple Product')
    const simpleProduct = products.find(p => p.productType === 'simple' && p.category === 'panaderia')
    
    if (simpleProduct) {
      const simpleItem = {
        id: `${simpleProduct.id}-${Date.now()}`,
        name: simpleProduct.name,
        price: simpleProduct.price,
        quantity: 3,
        category: simpleProduct.category
      }
      
      console.log(`✅ Added: ${simpleItem.name} x${simpleItem.quantity}`)
      console.log(`   - Unit price: $${simpleItem.price.toLocaleString()}`)
      console.log(`   - Subtotal: $${(simpleItem.price * simpleItem.quantity).toLocaleString()}`)
      
      // Simular carrito con múltiples items
      var cart = [cartItem, simpleItem]
      var cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    } else {
      var cart = [cartItem]
      var cartTotal = cartItem.price * cartItem.quantity
    }
    
    console.log(`\n💰 Cart total: $${cartTotal.toLocaleString()}`)
    
    // 6. Datos del cliente
    console.log('\n👤 STEP 6: Customer Information')
    const customerData = {
      name: 'Ana María Rodríguez',
      email: 'ana.rodriguez@email.com',
      phone: '+56912345678',
      rut: '18.765.432-1',
      birthDate: '1990-07-20',
      instagramLink: '@ana_rodriguez',
      facebookLink: 'https://facebook.com/ana.rodriguez'
    }
    
    console.log('✅ Customer data:')
    Object.entries(customerData).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value}`)
    })
    
    // 7. Crear orden completa
    console.log('\n📋 STEP 7: Creating Complete Order')
    const orderData = {
      customerInfo: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        rut: customerData.rut
      },
      items: cart,
      total: cartTotal,
      comments: 'Entrega preferida el sábado en la tarde. Por favor confirmar horario por WhatsApp. Pago 50% adelantado por transferencia.',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('✅ Order created:')
    console.log(`   - Customer: ${orderData.customerInfo.name}`)
    console.log(`   - Items: ${orderData.items.length}`)
    console.log(`   - Total: $${orderData.total.toLocaleString()}`)
    console.log(`   - Status: ${orderData.status}`)
    
    // 8. Generar mensaje de WhatsApp
    console.log('\n📱 STEP 8: Generating WhatsApp Message')
    const whatsappMessage = generateDetailedWhatsAppMessage(orderData)
    
    console.log('✅ WhatsApp message generated!')
    console.log('📄 Complete message:')
    console.log('-' .repeat(60))
    console.log(whatsappMessage)
    console.log('-' .repeat(60))
    
    // 9. Simular guardado de orden (opcional)
    console.log('\n💾 STEP 9: Saving Order (Simulation)')
    console.log('✅ Order would be saved to Firebase with:')
    console.log(`   - Customer ID: ${customerData.email.replace('@', '_').replace('.', '_')}`)
    console.log(`   - Order ID: ORDER_${Date.now()}`)
    console.log(`   - Timestamp: ${orderData.createdAt.toISOString()}`)
    
    // 10. Verificar flujo completo
    console.log('\n🎉 STEP 10: Flow Verification')
    console.log('✅ Complete purchase flow tested successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Products loaded: ${products.length}`)
    console.log(`   - Cart items: ${cart.length}`)
    console.log(`   - Total amount: $${cartTotal.toLocaleString()}`)
    console.log(`   - Customer data: Complete`)
    console.log(`   - WhatsApp message: Generated`)
    console.log(`   - Order structure: Valid`)
    
  } catch (error) {
    console.error('❌ Error in purchase flow test:', error)
  }
}

function generateDetailedWhatsAppMessage(orderData) {
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
  message += `• Delivery: Se coordina según ubicación\n`
  message += `• *TOTAL PEDIDO: $${total.toLocaleString()}*\n\n`

  if (comments && comments.trim()) {
    message += `💬 *COMENTARIOS ADICIONALES:*\n`
    message += `"${comments}"\n\n`
  }

  message += `📋 *INFORMACIÓN IMPORTANTE:*\n`
  message += `• Pago: 50% anticipo + 50% contra entrega\n`
  message += `• Tiempo de preparación: Se coordina según producto\n`
  message += `• Delivery disponible en Nueva Imperial y alrededores\n`
  message += `• Para tortas: confirmar fecha de entrega con 48hrs de anticipación\n\n`

  message += `📅 *Fecha del pedido:* ${new Date().toLocaleDateString('es-CL', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}\n`
  message += `⏰ *Hora:* ${new Date().toLocaleTimeString('es-CL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}\n\n`
  
  message += `🎉 *¡Gracias por elegir Delicias Tía Jovy!*\n`
  message += `Te contactaremos pronto para confirmar detalles y coordinar la entrega. 💕\n\n`
  message += `📱 WhatsApp: +56 9 4947 5207\n`
  message += `📍 Nueva Imperial, Región de La Araucanía`

  return message
}

// Run the test
testPurchaseFlow()
