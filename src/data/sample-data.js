// Datos de ejemplo para testing y desarrollo
// Este archivo contiene datos de muestra que puedes usar para probar la aplicación

export const sampleProducts = [
  // Tortas
  {
    id: 1,
    name: "Torta de Chocolate Premium",
    price: 18000,
    category: "tortas",
    image: "/images/torta-chocolate.jpg",
    description:
      "Deliciosa torta de chocolate con tres capas, relleno de manjar y cobertura de chocolate belga",
    featured: true,
    ingredients: [
      "Chocolate belga",
      "Manjar casero",
      "Huevos frescos",
      "Harina integral",
    ],
  },
  {
    id: 2,
    name: "Torta de Frutillas y Crema",
    price: 20000,
    category: "tortas",
    image: "/images/torta-frutilla.jpg",
    description:
      "Torta esponjosa con crema chantilly y frutillas frescas de temporada",
    featured: true,
    ingredients: [
      "Frutillas frescas",
      "Crema chantilly",
      "Bizcocho de vainilla",
      "Azúcar flor",
    ],
  },
  {
    id: 3,
    name: "Torta Tres Leches Tradicional",
    price: 16000,
    category: "tortas",
    image: "/images/torta-tres-leches.jpg",
    description: "Clásica torta tres leches con canela y un toque de vainilla",
    featured: false,
    ingredients: [
      "Leche condensada",
      "Leche evaporada",
      "Crema de leche",
      "Canela",
    ],
  },

  // Panadería
  {
    id: 4,
    name: "Pan Amasado Casero",
    price: 1800,
    category: "panaderia",
    image: "/images/pan-amasado.jpg",
    description: "Pan amasado tradicional chileno, recién horneado cada mañana",
    featured: true,
    ingredients: [
      "Harina de trigo",
      "Manteca de cerdo",
      "Sal marina",
      "Levadura natural",
    ],
  },
  {
    id: 5,
    name: "Empanadas de Pino Artesanales",
    price: 2800,
    category: "panaderia",
    image: "/images/empanadas.jpg",
    description:
      "Empanadas caseras de pino con carne, cebolla, huevo duro y aceituna",
    featured: false,
    ingredients: [
      "Carne molida",
      "Cebolla",
      "Huevo duro",
      "Aceitunas",
      "Masa casera",
    ],
  },
  {
    id: 6,
    name: "Sopaipillas Crujientes",
    price: 800,
    category: "panaderia",
    image: "/images/sopaipillas.jpg",
    description:
      "Sopaipillas doradas y crujientes, perfectas para acompañar el té",
    featured: false,
    ingredients: ["Zapallo", "Harina", "Manteca", "Sal"],
  },

  // Sin Azúcar
  {
    id: 7,
    name: "Torta Sin Azúcar con Stevia",
    price: 22000,
    category: "sin-azucar",
    image: "/images/torta-sin-azucar.jpg",
    description:
      "Torta especial endulzada con stevia natural, ideal para diabéticos",
    featured: true,
    ingredients: [
      "Stevia natural",
      "Harina integral",
      "Frutas frescas",
      "Yogurt natural",
    ],
  },
  {
    id: 8,
    name: "Galletas Integrales Avena",
    price: 3500,
    category: "sin-azucar",
    image: "/images/galletas-integrales.jpg",
    description:
      "Galletas integrales con avena, sin azúcar añadida, endulzadas naturalmente",
    featured: false,
    ingredients: ["Avena integral", "Miel de abeja", "Nueces", "Canela"],
  },

  // Ofertas
  {
    id: 9,
    name: "Combo Desayuno Familiar",
    price: 9500,
    originalPrice: 12000,
    category: "ofertas",
    image: "/images/combo-desayuno.jpg",
    description: "Pan amasado + mermelada casera + mantequilla + té de hierbas",
    featured: true,
    includes: [
      "2 panes amasados",
      "Mermelada de frutilla",
      "Mantequilla",
      "Té de hierbas",
    ],
  },
  {
    id: 10,
    name: "Pack Cumpleaños Completo",
    price: 28000,
    originalPrice: 35000,
    category: "ofertas",
    image: "/images/pack-cumpleanos.jpg",
    description: "Torta mediana + 12 cupcakes + velas + decoración",
    featured: false,
    includes: [
      "Torta 20cm",
      "12 cupcakes",
      "Velas numéricas",
      "Decoración temática",
    ],
  },
];

export const sampleOrders = [
  {
    id: "order-001",
    customerInfo: {
      name: "María González",
      email: "maria@email.com",
      phone: "+56987654321",
    },
    items: [
      { id: 1, name: "Torta de Chocolate Premium", price: 18000, quantity: 1 },
      { id: 4, name: "Pan Amasado Casero", price: 1800, quantity: 2 },
    ],
    total: 21600,
    comments:
      'Para retirar mañana a las 15:00. Torta con mensaje "Feliz Cumpleaños"',
    createdAt: new Date("2024-01-15T10:30:00"),
    status: "pending",
  },
  {
    id: "order-002",
    customerInfo: {
      name: "Carlos Rodríguez",
      email: "carlos@email.com",
      phone: "+56987654321",
    },
    items: [
      { id: 9, name: "Combo Desayuno Familiar", price: 9500, quantity: 1 },
      { id: 6, name: "Sopaipillas Crujientes", price: 800, quantity: 3 },
    ],
    total: 11900,
    comments: "Entrega a domicilio en Nueva Imperial centro",
    createdAt: new Date("2024-01-15T14:20:00"),
    status: "completed",
  },
  {
    id: "order-003",
    customerInfo: {
      name: "Ana Martínez",
      email: "ana@email.com",
      phone: "+56965432109",
    },
    items: [
      { id: 7, name: "Torta Sin Azúcar con Stevia", price: 22000, quantity: 1 },
    ],
    total: 22000,
    comments: "Sin azúcar por favor, es para una persona diabética",
    createdAt: new Date("2024-01-16T09:15:00"),
    status: "pending",
  },
];

export const businessInfo = {
  name: "Delicias Tía Jovy",
  slogan: "Endulzamos tu día",
  description:
    "Pastelería y mini market familiar en Nueva Imperial, Chile. Productos caseros hechos con amor y los mejores ingredientes.",
  address: "Nueva Imperial, Región de La Araucanía, Chile",
  phone: "+56984630545",
  whatsapp: "56984630545",
  email: "contacto@deliciastiajovy.cl",
  hours: {
    weekdays: "Lunes a Viernes: 8:00 - 20:00",
    saturday: "Sábado: 8:00 - 18:00",
    sunday: "Domingo: Cerrado",
  },
  socialMedia: {
    facebook: "https://facebook.com/deliciastiajovy",
    instagram: "https://instagram.com/deliciastiajovy",
    whatsapp: "https://wa.me/56984630545",
  },
  features: [
    "Productos caseros artesanales",
    "Ingredientes frescos y de calidad",
    "Entrega a domicilio en Nueva Imperial",
    "Opciones sin azúcar disponibles",
    "Tortas personalizadas",
    "Más de 15 años de experiencia",
  ],
};

export const categories = [
  {
    id: "tortas",
    name: "Tortas",
    icon: "🎂",
    description: "Tortas artesanales para toda ocasión",
    color: "#e91e63",
  },
  {
    id: "panaderia",
    name: "Panadería",
    icon: "🥖",
    description: "Pan fresco y productos de panadería",
    color: "#ff9800",
  },
  {
    id: "sin-azucar",
    name: "Sin Azúcar",
    icon: "🌿",
    description: "Opciones saludables sin azúcar añadida",
    color: "#4caf50",
  },
  {
    id: "ofertas",
    name: "Ofertas",
    icon: "🏷️",
    description: "Promociones y combos especiales",
    color: "#f44336",
  },
];

// Función helper para generar datos de prueba
export function generateSampleData() {
  return {
    products: sampleProducts,
    orders: sampleOrders,
    business: businessInfo,
    categories: categories,
  };
}
