<template>
  <div class="marketplace">
    <h1>🌿 Marketplace de Agricultores</h1>

    <!-- Botón para cargar productos desde el backend -->
    <button @click="fetchProducts">🔄 Cargar Productos</button>

    <!-- Formulario para agregar productos -->
    <div class="add-product">
      <h3>➕ Agregar Producto</h3>
      <input v-model="newProduct.name" placeholder="🍎 Nombre del producto" />
      <input v-model.number="newProduct.price" placeholder="💰 Precio ($)" type="number" />
      <input v-model.number="newProduct.quantity" placeholder="🛆 Cantidad (kg)" type="number" />
      <input v-model="newProduct.contacto" placeholder="📞 Contacto (número)" type="tel" />
      <select v-model="newProduct.type">
        <option value="venta">💲 Venta</option>
        <option value="intercambio">🔄 Intercambio</option>
      </select>
      <input type="file" @change="onFileChange" />
      <button @click="addProduct">✅ Agregar</button>
    </div>

    <div v-if="products.length === 0" class="loading">⏳ Cargando productos...</div>
    
    <div v-else class="products">
      <div v-for="product in products" :key="product._id" class="product">
        <img v-if="product.imageUrl" :src="`http://localhost:5000${product.imageUrl}`" alt="Imagen del producto" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p>💰 Precio: {{ product.type === 'venta' ? `$${product.price}` : '🔄 Intercambio' }}</p>
        <p>🛆 Cantidad: {{ product.quantity }} kg</p>
        <p>👤 Vendido por: {{ product.user || 'Usuario desconocido' }}</p>
        <p>📞 Contacto: {{ product.contacto }}</p>
        <div v-if="product.user === currentUser && (product.type === 'venta' || product.type === 'intercambio')">
  <button @click="editProduct(product)">✏️ Editar</button>
  <button @click="deleteProduct(product._id)">❌ Eliminar</button>
</div>
        
        </div>
      </div>
    </div>
  
</template>

<script>
import axios from '../plugins/axios';

export default {
  data() {
    return {
      products: [],
      currentUser: "", // Aquí guardaremos el usuario autenticado
      newProduct: {
        name: "",
        price: 0,
        quantity: 0,
        user: "",
        type: "venta",
        image: null,
        contacto: ""
      }
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("api/products");
        console.log("Productos cargados:", response.data);  // Para verificar los datos
        this.products = response.data;
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    },

    async fetchCurrentUser() {
      try {
        const token = localStorage.getItem("token"); // Obtén el token desde localStorage
        if (!token) {
          console.error("No se ha encontrado el token.");
          return;
        }
        const { data } = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(data);  
        this.currentUser = data.user.username; // Ahora guardamos correctamente el nombre de usuario
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    },

    onFileChange(event) {
      this.newProduct.image = event.target.files[0];
    },

    async addProduct() {
      if (!this.newProduct.name || this.newProduct.quantity <= 0 || !this.newProduct.image || !this.newProduct.contacto) {
        alert("Completa todos los campos correctamente.");
        return;
      }

      // Asignamos automáticamente el usuario autenticado al producto
      this.newProduct.user = this.currentUser;

      const formData = new FormData();
      formData.append("name", this.newProduct.name);
      formData.append("price", this.newProduct.price);
      formData.append("quantity", this.newProduct.quantity);
      formData.append("user", this.newProduct.user);
      formData.append("type", this.newProduct.type);
      formData.append("image", this.newProduct.image);
      formData.append("contacto", this.newProduct.contacto);

      try {
        await axios.post("api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        this.fetchProducts();
        this.newProduct = { name: "", price: 0, quantity: 0, user: "", type: "venta", image: null, contacto: "" };
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    },

    async deleteProduct(id) {
      if (confirm("¿Estás seguro de eliminar este producto?")) {
        try {
          await axios.delete(`api/products/${id}`);
          this.fetchProducts();
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
        }
      }
    },

    editProduct(product) {
      const newName = prompt("Editar nombre del producto", product.name);
      if (newName !== null) {
        axios.put(`api/products/${product._id}`, { name: newName })
          .then(() => this.fetchProducts())
          .catch(error => console.error("Error al editar producto:", error));
      }
    }
  },

  mounted() {
    this.fetchProducts();
    this.fetchCurrentUser(); // Llamamos la función para obtener el usuario autenticado
  }
};
</script>

<style scoped>
.marketplace {
  text-align: center;
  padding: 20px;
}

.add-product {
  margin-bottom: 20px;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
}
.add-product input, .add-product select {
  margin: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.add-product button {
  background-color: #28a745;
  color: white;
  padding: 8px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
.add-product button:hover {
  background-color: #218838;
}

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}
.product {
  background: white;
  border-radius: 10px;
  padding: 15px;
  width: 220px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}
.product:hover {
  transform: scale(1.05);
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}
</style>

