<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold text-green-600 text-center mb-6">🦠 Reportar Plaga</h1>

    <form @submit.prevent="submitPlaga" class="space-y-4">
      <div>
        <label class="block font-semibold text-gray-700">Nombre de la Plaga</label>
        <input v-model="plaga.nombre" type="text" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500" />
      </div>

      <div>
        <label class="block font-semibold text-gray-700">Cultivos Afectados</label>
        <input v-model="plaga.cultivos" type="text" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500" />
      </div>

      <div>
        <label class="block font-semibold text-gray-700">Síntomas</label>
        <textarea v-model="plaga.sintomas" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"></textarea>
      </div>

      <div>
        <label class="block font-semibold text-gray-700">Método de Control</label>
        <textarea v-model="plaga.control" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"></textarea>
      </div>

      <div>
        <label class="block font-semibold text-gray-700">Imagen de la Plaga</label>
        <input type="file" @change="handleFileUpload" accept="image/*" class="w-full p-2 border rounded-md" />
      </div>

      <div v-if="previewImage" class="mt-4">
        <p class="text-gray-600 text-sm">Vista previa de la imagen:</p>
        <img :src="previewImage" alt="Vista previa" class="w-40 h-40 object-cover rounded-md border mt-2" />
      </div>

      <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
        📤 Reportar Plaga
      </button>

      <!-- Botón para ver plagas reportadas -->
      <router-link to="/ver-plagas" class="block text-center mt-4">
        <button class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          👀 Ver Plagas Reportadas
        </button>
      </router-link>
    </form>
  </div>
</template>

<script>
import axios from '../plugins/axios'
export default {
  data() {
    return {
      plaga: {
        nombre: "",
        cultivos: "",
        sintomas: "",
        control: ""
      },
      imagen: null,
      previewImage: null
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagen = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },
    async submitPlaga() {
      try {
        const formData = new FormData();
        formData.append("nombre", this.plaga.nombre);
        formData.append("cultivos", this.plaga.cultivos);
        formData.append("sintomas", this.plaga.sintomas);
        formData.append("control", this.plaga.control);
        if (this.imagen) {
          formData.append("imagen", this.imagen);
        }

        await axios.post("api/Plagas", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("✅ Plaga reportada con éxito");
        this.resetForm();
        
        // Redirigir automáticamente a VerPlagas.vue
        this.$router.push("/ver-plagas");
      } catch (error) {
        console.error("Error al reportar la plaga:", error);
        alert("❌ Error al reportar la plaga");
      }
    },
    resetForm() {
      this.plaga = { nombre: "", cultivos: "", sintomas: "", control: "" };
      this.imagen = null;
      this.previewImage = null;
    }
  }
};
</script>


<style scoped>
input, textarea {
  outline: none;
}
</style>

  
  <style scoped>
  /* Personaliza estilos si es necesario */
  </style>
  