// Configuración del negocio Delicias Tía Jovy
export const businessConfig = {
  // Información básica
  name: "Delicias Tía Jovy",
  slogan: "Endulzamos tu día",
  description:
    "Pastelería y mini market familiar en Nueva Imperial, Chile. Productos caseros hechos con amor y los mejores ingredientes.",

  // Contacto
  contact: {
    email: "deliciastiajovy@gmail.com",
    phone: "+56 9 4947 5207", // Número de pruebas para desarrollo
    whatsapp: "56949475207", // Número de pruebas para desarrollo
    address: "Nueva Imperial, Región de La Araucanía, Chile",
  },

  // Horarios
  hours: {
    weekdays: "Lunes a Viernes: 8:00 - 20:00",
    saturday: "Sábado: 8:00 - 18:00",
    sunday: "Domingo: Cerrado",
  },

  // Redes sociales
  social: {
    facebook: "https://facebook.com/deliciastiajovy",
    instagram: "https://instagram.com/deliciastiajovy",
    whatsapp: "https://wa.me/56949475207", // Número de pruebas para desarrollo
  },

  // Características del negocio
  features: [
    "Productos caseros artesanales",
    "Ingredientes frescos y de calidad",
    "Entrega a domicilio en Nueva Imperial",
    "Opciones sin azúcar disponibles",
    "Tortas personalizadas",
    "Más de 15 años de experiencia",
  ],

  // Configuración de pedidos
  orders: {
    minAmount: 5000, // Monto mínimo de pedido
    deliveryFee: 2000, // Costo de delivery
    freeDeliveryFrom: 20000, // Delivery gratis desde este monto
    deliveryAreas: [
      "Nueva Imperial Centro",
      "Nueva Imperial Norte",
      "Nueva Imperial Sur",
      "Cholchol",
      "Carahue",
    ],
  },

  // Métodos de pago
  paymentMethods: [
    "Efectivo",
    "Transferencia bancaria",
    "Tarjeta de débito",
    "Tarjeta de crédito",
  ],
};

// Configuración de Firebase Auth
export const authConfig = {
  adminEmail: "deliciastiajovy@gmail.com",
  adminPassword: "123456", // Solo para referencia, no usar en producción
};

// Mensajes predefinidos para WhatsApp
export const whatsappMessages = {
  welcome: "¡Hola! Gracias por contactar a Delicias Tía Jovy 🧁",
  orderConfirmation:
    "Tu pedido ha sido recibido. Te contactaremos pronto para confirmar los detalles.",
  deliveryInfo:
    "Realizamos entregas en Nueva Imperial y alrededores. El costo de delivery es de $2.000 (gratis en compras sobre $20.000).",
};

// Configuración de la aplicación
export const appConfig = {
  name: "Delicias Tía Jovy",
  version: "1.0.0",
  environment: "production",
  supportEmail: "soporte@deliciastiajovy.cl",
};
