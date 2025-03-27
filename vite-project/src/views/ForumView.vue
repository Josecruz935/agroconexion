<template>
  <div class="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-green-700 text-center mb-6">Foro de Agrosync</h1>
      
      <!-- Formulario para nuevo tema -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-green-800 mb-4">Crear un nuevo tema</h2>
        <input v-model="nuevoTema.tema" type="text" placeholder="Título del tema" 
          class="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500">
        <textarea v-model="nuevoTema.descripcion" rows="3" placeholder="Descripción del tema"
          class="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
        <button @click="agregarTema" 
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          Publicar Tema
        </button>
      </div>
      
      <!-- Lista de temas -->
      <div v-for="tema in temas" :key="tema._id" class="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 class="text-xl font-bold text-green-700">{{ tema.tema }}</h3>
        <p class="text-gray-700 mb-2">{{ tema.descripcion }}</p>
        <p class="text-sm text-gray-500">Publicado por: <span class="font-semibold">{{ tema.usuario }}</span> el {{ new Date(tema.fecha).toLocaleString() }}</p>
        
        <!-- Comentarios -->
        <div class="bg-gray-50 p-4 rounded-md mt-4">
          <h4 class="text-lg font-semibold text-green-800 mb-3">Comentarios</h4>
          <div v-for="comentario in tema.comentarios" :key="comentario._id" class="mb-3 p-3 border-l-4 border-green-500 bg-gray-100 rounded-md">
            <p class="text-gray-700">
  <span class="font-semibold text-green-700">{{ comentario.usuario }}:</span> {{ comentario.texto }}
</p>
          </div>
          
          <!-- Agregar comentario -->
          <input v-model="nuevoComentario[tema._id]" type="text" placeholder="Añadir un comentario..."
            class="w-full p-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <button @click="agregarComentario(tema._id)" 
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2 transition duration-300">
            Comentar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '../plugins/axios';

  export default {
  data() {
    return {
      usuarioActual: "", // Aquí se guarda el nombre del usuario autenticado
      nuevoTema: { tema: "", descripcion: "", usuario: "" },
      nuevoComentario: {},
      temas: []
    };
  },
  async created() {
    await this.obtenerUsuario(); // Obtiene el usuario desde el backend
    await this.fetchTemas(); // Obtiene los temas
  },
  methods: {
    async obtenerUsuario() {
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${this.token}` } // Agregar token
        });
        this.usuarioActual = response.data.user.username; // Guarda el nombre del usuario
        this.nuevoTema.usuario = this.usuarioActual; // Asigna el usuario al tema nuevo
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        this.usuarioActual = "Usuario Anónimo"; // Si falla, usa un valor por defecto
      }
    },
    async fetchTemas() {
      try {
        const response = await axiosInstance.get("/api/Foro");
        this.temas = response.data;
      } catch (error) {
        console.error("Error al obtener los temas:", error);
      }
    },
    async agregarTema() {
      if (this.nuevoTema.tema.trim() && this.nuevoTema.descripcion.trim()) {
        try {
          this.nuevoTema.usuario = this.usuarioActual; // Asegura que usa el nombre del usuario
          console.log("Enviando tema:", this.nuevoTema);
          const response = await axiosInstance.post("/api/Foro", this.nuevoTema);
          console.log("Respuesta:", response.data);
          this.temas.unshift(response.data);
          this.nuevoTema.tema = "";
          this.nuevoTema.descripcion = "";
        } catch (error) {
          console.error("Error al agregar tema:", error);
        }
      }
    },
    async agregarComentario(temaId) {
      if (this.nuevoComentario[temaId]?.trim()) {
        try {
          const comentario = {
            usuario: this.usuarioActual, // Usa el nombre del usuario autenticado
            texto: this.nuevoComentario[temaId] // Corregido para coincidir con el backend
          };
          console.log("Enviando comentario:", comentario);
          const response = await axiosInstance.post(`/api/Foro/${temaId}/comentarios`, comentario);
          console.log("Respuesta:", response.data);
          const tema = this.temas.find(t => t._id === temaId);
          tema.comentarios.push(comentario);
          this.nuevoComentario[temaId] = "";
        } catch (error) {
          console.error("Error al agregar comentario:", error);
        }
      }
    }
  }
};

</script>

<style scoped>
input, textarea {
  transition: all 0.3s ease;
}
input:focus, textarea:focus {
  border-color: #34D399;
  box-shadow: 0 0 5px rgba(52, 211, 153, 0.5);
}
</style>
