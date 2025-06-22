import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useCartStore = defineStore("cart", () => {
  // State - Load from localStorage
  const items = ref(JSON.parse(localStorage.getItem("cart-items") || "[]"));
  const isModalOpen = ref(false);
  const showNotification = ref(false);
  const lastAddedProduct = ref(null);

  // Watch for changes and persist to localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem("cart-items", JSON.stringify(newItems));
    },
    { deep: true }
  );

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  });

  const formattedTotal = computed(() => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(totalPrice.value);
  });

  // Actions
  function addItem(product) {
    // Para productos configurables (tortas), cada configuración es única
    // por lo que no debemos buscar items existentes, siempre agregar nuevo
    if (product.configuration) {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
        configuration: product.configuration, // ✅ Preservar configuración
      });
    } else {
      // Para productos simples, buscar si ya existe y aumentar cantidad
      const existingItem = items.value.find(
        (item) => item.id === product.id && !item.configuration
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        items.value.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
        });
      }
    }

    // Trigger notification
    lastAddedProduct.value = product.name;
    showNotification.value = true;

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  }

  function removeItem(productId) {
    const index = items.value.findIndex((item) => item.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  function openModal() {
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  function toggleModal() {
    isModalOpen.value = !isModalOpen.value;
  }

  return {
    // State
    items,
    isModalOpen,
    showNotification,
    lastAddedProduct,
    // Getters
    itemCount,
    totalPrice,
    formattedTotal,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openModal,
    closeModal,
    toggleModal,
  };
});
