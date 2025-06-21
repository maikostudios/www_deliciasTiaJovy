# 🔥 Firebase - Delicias Tía Jovy

## ✅ Configuración Completada

### 📋 Información del Proyecto
- **Project ID**: `deliciastiajovy-6cd88`
- **Auth Domain**: `deliciastiajovy-6cd88.firebaseapp.com`
- **Storage Bucket**: `deliciastiajovy-6cd88.firebasestorage.app`

### 🔐 Autenticación Configurada
- **Método**: Email/Password
- **Usuario Admin**: `deliciastiajovy@gmail.com`
- **Contraseña**: `123456`

### 🗄️ Firestore Database
- **Estado**: ✅ Activado
- **Modo**: Producción (configurar reglas según necesidades)

## 🚀 Cómo Probar la Configuración

### 1. Acceder al Panel de Administración
1. Ve a: http://localhost:5173/login
2. Ingresa las credenciales:
   - Email: `deliciastiajovy@gmail.com`
   - Contraseña: `123456`
3. Haz clic en "Iniciar Sesión"

### 2. Usar el Panel de Pruebas
Una vez en el panel de administración, verás una sección "🔧 Pruebas de Firebase" donde puedes:

- **🔐 Probar Auth**: Verifica que la autenticación funcione
- **🗄️ Probar Firestore**: Verifica que la base de datos funcione
- **📦 Inicializar Datos**: Crea productos de ejemplo en Firestore
- **🚀 Probar Todo**: Ejecuta todas las pruebas automáticamente

### 3. Verificar en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona el proyecto `deliciastiajovy-6cd88`
3. Verifica:
   - **Authentication > Users**: Debe aparecer el usuario admin
   - **Firestore Database**: Debe mostrar las colecciones creadas

## 📊 Estructura de Datos en Firestore

### Colecciones Principales:

#### `products` - Productos del catálogo
```javascript
{
  id: "torta-chocolate",
  name: "Torta de Chocolate Premium",
  price: 18000,
  category: "tortas",
  description: "Deliciosa torta de chocolate...",
  featured: true,
  available: true,
  createdAt: timestamp
}
```

#### `orders` - Pedidos de clientes
```javascript
{
  customerInfo: {
    name: "María González",
    email: "maria@email.com",
    phone: "+56987654321"
  },
  items: [
    {
      id: "torta-chocolate",
      name: "Torta de Chocolate Premium",
      price: 18000,
      quantity: 1
    }
  ],
  total: 18000,
  comments: "Para retirar mañana a las 15:00",
  createdAt: timestamp,
  status: "pending"
}
```

#### `config` - Configuración del negocio
```javascript
{
  business: {
    name: "Delicias Tía Jovy",
    email: "deliciastiajovy@gmail.com",
    phone: "+56 9 1234 5678",
    address: "Nueva Imperial, Chile",
    hours: { ... },
    updatedAt: timestamp
  }
}
```

## 🔒 Reglas de Seguridad Recomendadas

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos - lectura pública, escritura solo admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'deliciastiajovy@gmail.com';
    }
    
    // Pedidos - escritura pública, lectura solo admin
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && request.auth.token.email == 'deliciastiajovy@gmail.com';
    }
    
    // Configuración - solo admin
    match /config/{configId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'deliciastiajovy@gmail.com';
    }
    
    // Colección de pruebas - solo para testing
    match /test/{testId} {
      allow read, write: if true;
    }
  }
}
```

## 🛠️ Funcionalidades Implementadas

### ✅ Autenticación
- Login de administrador
- Protección de rutas
- Manejo de sesiones
- Logout seguro

### ✅ Base de Datos
- Almacenamiento de pedidos
- Gestión de productos
- Configuración del negocio
- Datos de prueba

### ✅ Integración Frontend
- Stores de Pinia conectados a Firebase
- Componentes reactivos
- Manejo de errores
- Estados de carga

## 🔧 Comandos Útiles

### Verificar Estado de Firebase
```bash
# En la consola del navegador (F12)
import { runAllTests } from './src/utils/firebase-test.js'
runAllTests()
```

### Reiniciar Datos de Prueba
```bash
# En el panel de administración
# Hacer clic en "📦 Inicializar Datos"
```

## 📱 Próximos Pasos

### 1. Configurar WhatsApp
- Actualizar número de teléfono real en `src/config/business.js`
- Probar integración de mensajes

### 2. Agregar Productos Reales
- Usar el panel de administración para agregar productos
- Subir imágenes de productos reales

### 3. Configurar Dominio (Opcional)
- Configurar Firebase Hosting
- Conectar dominio personalizado

### 4. Optimizar Seguridad
- Implementar reglas de Firestore más específicas
- Configurar límites de uso

## 🆘 Solución de Problemas

### Error: "Firebase not initialized"
- Verificar que `src/main.js` tenga la configuración correcta
- Revisar que Firebase esté importado correctamente

### Error: "Permission denied"
- Verificar reglas de Firestore
- Confirmar que el usuario esté autenticado

### Error: "Network error"
- Verificar conexión a internet
- Revisar configuración de proxy/firewall

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Usa el panel de pruebas en `/admin`
3. Verifica la configuración en Firebase Console

---

🎉 **¡Firebase está listo para Delicias Tía Jovy!** 🧁
