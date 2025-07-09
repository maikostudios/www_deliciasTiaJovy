import { defineStore } from "pinia";
import { ref, watch, onMounted } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/main.js";

export const useOrdersStore = defineStore("orders", () => {
  // State
  const orders = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const isOrderModalOpen = ref(false);
  const isSuccessModalOpen = ref(false);
  const lastOrder = ref(null);

  // Actions
  async function createOrder(orderData) {
    try {
      loading.value = true;
      error.value = null;

      const order = {
        ...orderData,
        createdAt: new Date(),
        status: "pending",
      };

      const docRef = await addDoc(collection(db, "orders"), order);

      // Add the order to local state with the generated ID
      orders.value.unshift({
        id: docRef.id,
        ...order,
      });

      return { success: true, orderId: docRef.id };
    } catch (err) {
      error.value = err.message;
      console.error("Error creating order:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrders() {
    try {
      loading.value = true;
      error.value = null;

      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      orders.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching orders:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  function openOrderModal() {
    isOrderModalOpen.value = true;
  }

  function closeOrderModal() {
    isOrderModalOpen.value = false;
  }

  function openSuccessModal() {
    isSuccessModalOpen.value = true;
  }

  function closeSuccessModal() {
    isSuccessModalOpen.value = false;
    // Clear lastOrder after modal closes
    setTimeout(() => {
      lastOrder.value = null;
    }, 300);
  }

  function setLastOrder(orderData) {
    lastOrder.value = orderData;
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      loading.value = true;
      error.value = null;

      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Update local state
      const orderIndex = orders.value.findIndex(
        (order) => order.id === orderId
      );
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = newStatus;
        orders.value[orderIndex].updatedAt = new Date();
      }

      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error("Error updating order status:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function deleteOrder(orderId) {
    try {
      loading.value = true;
      error.value = null;

      await deleteDoc(doc(db, "orders", orderId));

      // Remove from local state
      orders.value = orders.value.filter((order) => order.id !== orderId);

      return { success: true };
    } catch (err) {
      error.value = err.message;
      console.error("Error deleting order:", err);
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function generateWhatsAppMessage(orderData) {
    const { customerInfo, items, comments, total } = orderData;

    let message = `🧁 NUEVO PEDIDO - DELICIAS TÍA JOVY 🧁\n\n`;
    message += `👤 DATOS DEL CLIENTE:\n`;
    message += `• Nombre: ${customerInfo.name}\n`;
    message += `• Email: ${customerInfo.email}\n`;
    message += `• Teléfono: ${formatPhoneNumber(customerInfo.phone)}\n`;
    if (customerInfo.rut) {
      message += `• RUT: ${customerInfo.rut}\n`;
    }
    message += `\n`;

    message += `🛒 DETALLE DEL PEDIDO:\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    // Calcular precios separados
    let subtotalProductos = 0;
    let subtotalExtras = 0;

    items.forEach((item, index) => {
      message += `\n📦 PRODUCTO ${index + 1}:\n`;

      // Calcular precio base del producto (sin extras)
      let precioBase = item.price;
      let precioExtras = 0;

      if (item.configuration && item.configuration.extras) {
        item.configuration.extras.forEach((extraId) => {
          const extraInfo = getExtraInfo(extraId);
          if (typeof extraInfo.price === "number") {
            precioExtras += extraInfo.price;
          }
        });
        precioBase = item.price - precioExtras;
      }

      message += `🧁 ${item.name}\n`;

      // Mostrar relleno directamente después del nombre (si existe)
      if (item.configuration && item.configuration.filling) {
        const fillingInfo = getFillingInfo(item.configuration.filling);
        message += `   Relleno : ${fillingInfo.name}\n`;
      }

      message += `📊 Cantidad: ${item.quantity} unidad${
        item.quantity > 1 ? "es" : ""
      }\n`;
      message += `💵 Precio unitario PRODUCTO ${
        index + 1
      }: $${precioBase.toLocaleString()}\n`;

      // Mostrar extras si existen
      if (
        item.configuration &&
        item.configuration.extras &&
        item.configuration.extras.length > 0
      ) {
        const extrasNames = item.configuration.extras
          .map((extraId) => {
            const extraInfo = getExtraInfo(extraId);
            return extraInfo.name;
          })
          .join(", ");
        message += `   Extras Opcionales: ${extrasNames}\n`;
        message += `   Precio unitario extras : $${precioExtras.toLocaleString()}\n`;
      }

      message += `💰 \n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      // Acumular totales
      subtotalProductos += precioBase * item.quantity;
      subtotalExtras += precioExtras * item.quantity;
    });

    message += `\n💰 RESUMEN FINANCIERO:\n`;
    message += `• Subtotal productos: $${total.toLocaleString()}\n`;
    message += `• TOTAL PEDIDO: $${total.toLocaleString()}\n\n`;

    // Comentarios generales del pedido
    if (comments && comments.trim()) {
      message += `💬 COMENTARIOS ADICIONALES:\n`;
      message += `"${comments}"\n\n`;
    }

    // Información de entrega y pago
    message += `📋 INFORMACIÓN IMPORTANTE:\n`;
    message += `• Pago: 50% anticipo + 50% contra entrega\n`;
    message += `• Tiempo de preparación: Se coordina según producto\n`;
    message += `• Se Prefiere que el Cliente retire su pedido en el LOCAL  .\n`;
    message += `El Delivery puede estar disponible en Nueva Imperial y alrededores (Labranza, Temuco, Carahue ,  Sectores Rurales , o a convenir ) con un pago Extra dependiendo la distancia que se coordinará con la Pastelera según disponibilidad.\n`;
    message += `• Para tortas: confirmar fecha de entrega con mínimo de 48hrs de anticipación\n\n`;

    message += `📅 Fecha del pedido: ${new Date().toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}\n`;
    message += `⏰ Hora: ${new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}\n\n`;

    message += `🎉 ¡Gracias por elegir Delicias Tía Jovy!\n`;
    message += `Te contactaremos pronto para confirmar detalles y coordinar la entrega. 💕\n\n`;
    message += `📱 WhatsApp: ‪+56 9 4947 5207‬\n`;
    message += `📍 Nueva Imperial, Región de La Araucanía`;

    return encodeURIComponent(message);
  }

  // Funciones auxiliares para obtener información detallada
  function formatPhoneNumber(phone) {
    // Formatear teléfono como ‪+56 9 4947 5207‬
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("56")) {
      const number = cleaned.substring(2);
      return `‪+56 ${number.substring(0, 1)} ${number.substring(
        1,
        5
      )} ${number.substring(5)}‬`;
    }
    return phone;
  }

  function getSizeInfo(size) {
    const sizeDescriptions = {
      10: "Torta pequeña - ideal para reuniones íntimas",
      15: "Torta mediana - perfecta para celebraciones familiares",
      20: "Torta grande - ideal para fiestas medianas",
      25: "Torta extra grande - perfecta para eventos",
      30: "Torta jumbo - ideal para celebraciones grandes",
      35: "Torta mega - perfecta para eventos corporativos",
      40: "Torta gigante - ideal para grandes celebraciones",
    };
    return sizeDescriptions[size] || "Tamaño personalizado";
  }

  function getFillingInfo(fillingId) {
    const fillings = {
      "pina-crema-pina": {
        name: "Piña con crema de piña",
        category: "Frutal tropical",
      },
      "pina-crema-manjar": {
        name: "Piña con crema de manjar",
        category: "Frutal dulce",
      },
      "pina-crema-durazno": {
        name: "Piña con crema de durazno",
        category: "Frutal mixto",
      },
      "pina-crema-frutilla": {
        name: "Piña con crema de frutilla",
        category: "Frutal mixto",
      },
      "durazno-crema-durazno": {
        name: "Durazno con crema de durazno",
        category: "Frutal clásico",
      },
      "durazno-crema-manjar": {
        name: "Durazno con crema de manjar",
        category: "Frutal dulce",
      },
      "durazno-crema-frutilla": {
        name: "Durazno con crema de frutilla",
        category: "Frutal mixto",
      },
      "moca-tradicional": {
        name: "Moca tradicional pura crema",
        category: "Chocolate clásico",
      },
      "moca-durazno-manjar": {
        name: "Moca con durazno y manjar",
        category: "Chocolate frutal",
      },
      "frutilla-crema-frutilla": {
        name: "Frutilla con crema de frutilla",
        category: "Frutal intenso",
      },
      "frutilla-crema-manjar": {
        name: "Frutilla con crema de manjar",
        category: "Frutal dulce",
      },
      "selva-negra": {
        name: "Selva negra con mermelada de ciruela y crema manjar",
        category: "Chocolate gourmet",
      },
      "frambuesa-crema-manjar": {
        name: "Frambuesa con crema de manjar",
        category: "Frutal premium",
      },
      "frambuesa-crema-frambuesa": {
        name: "Frambuesa con crema de frambuesa",
        category: "Frutal intenso",
      },
    };
    return (
      fillings[fillingId] || { name: fillingId, category: "Personalizado" }
    );
  }

  function getExtraInfo(extraId) {
    const extras = {
      "lamina-comestible": {
        name: "Lámina comestible personalizada",
        price: "variable",
        description: "Imagen comestible con diseño personalizado",
      },
      topper: {
        name: "Topper personalizado",
        price: "variable",
        description: "Decoración superior personalizada",
      },
      "tercer-relleno": {
        name: "Tercer relleno adicional",
        price: 3000,
        description: "Relleno extra para mayor variedad",
      },
      nueces: {
        name: "Agregado de nueces",
        price: 2500,
        description: "Nueces naturales para decoración y sabor",
      },
    };
    return (
      extras[extraId] || {
        name: extraId,
        price: 0,
        description: "Extra personalizado",
      }
    );
  }

  function openWhatsApp(orderData, phoneNumber = "56984630545") {
    // Número real de WhatsApp de Delicias Tía Jovy
    const message = generateWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  }

  // Persistencia con sessionStorage
  watch(
    lastOrder,
    (newOrder) => {
      if (newOrder) {
        sessionStorage.setItem("lastOrder", JSON.stringify(newOrder));
      } else {
        sessionStorage.removeItem("lastOrder");
      }
    },
    { deep: true }
  );

  // Restaurar lastOrder al montar
  onMounted(() => {
    const stored = sessionStorage.getItem("lastOrder");
    if (stored) {
      try {
        lastOrder.value = JSON.parse(stored);
      } catch (error) {
        console.warn("Error parsing stored lastOrder:", error);
        sessionStorage.removeItem("lastOrder");
      }
    }
  });

  return {
    // State
    orders,
    loading,
    error,
    isOrderModalOpen,
    isSuccessModalOpen,
    lastOrder,
    // Actions
    createOrder,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    openOrderModal,
    closeOrderModal,
    openSuccessModal,
    closeSuccessModal,
    setLastOrder,
    clearError,
    generateWhatsAppMessage,
    openWhatsApp,
  };
});
