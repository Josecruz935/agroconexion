<template>
    <div class="max-w-6xl mx-auto p-6">
      <h1 class="text-3xl font-bold text-green-600 text-center mb-6">🌱 Plagas Reportadas</h1>
  
      <!-- Mensaje si no hay plagas -->
      <p v-if="plagas.length === 0" class="text-center text-gray-500">No hay plagas reportadas.</p>
  
      <!-- Tarjetas de plagas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="plaga in plagas"
          :key="plaga._id"
          class="bg-white rounded-lg shadow-lg p-5 border border-gray-200"
        >
          <!-- Imagen de la plaga -->
          <img v-if="plaga.imagen" :src="`http://localhost:5000${plaga.imagen}`" alt="Plaga"
            class="w-full h-40 object-cover rounded-md border mb-3" />
  
          <!-- Información de la plaga -->
          <h2 class="text-xl font-bold text-gray-700">{{ plaga.nombre }}</h2>
          <p class="text-sm text-gray-600"><strong>🪴 Cultivos Afectados:</strong> {{ plaga.cultivos }}</p>
          <p class="text-sm text-gray-600 mt-2"><strong>⚠️ Síntomas:</strong> {{ plaga.sintomas }}</p>
          <p class="text-sm text-gray-600 mt-2"><strong>🛠️ Control:</strong> {{ plaga.control }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../plugins/axios'
  
  export default {
    data() {
      return {
        plagas: []
      };
    },
    async mounted() {
      await this.getPlagas();
    },
    methods: {
      async getPlagas() {
        try {
          const response = await axios.get("api/Plagas");
          this.plagas = response.data;
        } catch (error) {
          console.error("Error al obtener las plagas:", error);
        }
      }
    }
  };
  </script>
  