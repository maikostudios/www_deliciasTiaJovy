// Ejemplo de configuración de Firebase
// Copia este archivo y renómbralo como firebase-config.js
// Luego reemplaza los valores con tu configuración real de Firebase

export const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id-aqui"
}

// Configuración adicional
export const whatsappConfig = {
  // Número de WhatsApp para recibir pedidos (formato: 56912345678)
  phoneNumber: "56912345678",
  // Mensaje de bienvenida personalizado
  welcomeMessage: "¡Hola! Gracias por contactar a Delicias Tía Jovy 🧁"
}

// Configuración del negocio
export const businessConfig = {
  name: "Delicias Tía Jovy",
  address: "Nueva Imperial, Chile",
  email: "contacto@deliciastiajovy.cl",
  phone: "+56 9 1234 5678",
  hours: "Lun - Sáb: 8:00 - 20:00"
}
