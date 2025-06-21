import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/main.js'

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const isOrderModalOpen = ref(false)

  // Actions
  async function createOrder(orderData) {
    try {
      loading.value = true
      error.value = null

      const order = {
        ...orderData,
        createdAt: new Date(),
        status: 'pending'
      }

      const docRef = await addDoc(collection(db, 'orders'), order)
      
      // Add the order to local state with the generated ID
      orders.value.unshift({
        id: docRef.id,
        ...order
      })

      return { success: true, orderId: docRef.id }
    } catch (err) {
      error.value = err.message
      console.error('Error creating order:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchOrders() {
    try {
      loading.value = true
      error.value = null

      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      orders.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching orders:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  function openOrderModal() {
    isOrderModalOpen.value = true
  }

  function closeOrderModal() {
    isOrderModalOpen.value = false
  }

  function clearError() {
    error.value = null
  }

  function generateWhatsAppMessage(orderData) {
    const { customerInfo, items, comments, total } = orderData
    
    let message = `🧁 *NUEVO PEDIDO - DELICIAS TÍA JOVY* 🧁\n\n`
    message += `👤 *Cliente:* ${customerInfo.name}\n`
    message += `📧 *Email:* ${customerInfo.email}\n`
    message += `📱 *Teléfono:* ${customerInfo.phone}\n\n`
    
    message += `🛒 *PRODUCTOS:*\n`
    items.forEach(item => {
      message += `• ${item.name} x${item.quantity} - $${item.price.toLocaleString()}\n`
    })
    
    message += `\n💰 *TOTAL: $${total.toLocaleString()}*\n\n`
    
    if (comments && comments.trim()) {
      message += `💬 *Comentarios:* ${comments}\n\n`
    }
    
    message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-CL')}\n`
    message += `⏰ *Hora:* ${new Date().toLocaleTimeString('es-CL')}\n\n`
    message += `¡Gracias por tu pedido! 💕`
    
    return encodeURIComponent(message)
  }

  function openWhatsApp(orderData, phoneNumber = '56949475207') {
    // Número real de WhatsApp de Delicias Tía Jovy
    const message = generateWhatsAppMessage(orderData)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return {
    // State
    orders,
    loading,
    error,
    isOrderModalOpen,
    // Actions
    createOrder,
    fetchOrders,
    openOrderModal,
    closeOrderModal,
    clearError,
    generateWhatsAppMessage,
    openWhatsApp
  }
})
