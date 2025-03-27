<template>
  <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Mi Perfil</h2>

    <div class="flex items-center space-x-4">
      <!-- Foto de perfil -->
      <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-2 border-green-500">
        <img v-if="user.imagen" :src="`http://localhost:5000${user.imagen}`" alt="Foto de perfil" class="w-24 h-24 rounded-full object-cover" />
        
      </div>

      <!-- Datos del usuario -->
      <div>
        <h3 class="text-xl font-medium text-gray-700">{{ user.username || 'Usuario' }}</h3>
        <p class="text-gray-500">{{ user.email || 'correo@example.com' }}</p>
      </div>
    </div>

    <!-- Formulario de actualización -->
    <div class="mt-6">
      <label class="block text-gray-700 text-sm font-medium">Nombre de Usuario</label>
      <input v-model="user.username" type="text" class="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />

      <label class="block text-gray-700 text-sm font-medium mt-4">Correo Electrónico</label>
      <input v-model="user.email" type="email" class="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" disabled />

      <!-- Subir Foto de Perfil -->
      <label class="block text-gray-700 text-sm font-medium mt-4">Foto de Perfil</label>
      <input type="file" @change="handleFileUpload" accept="image/*" class="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />

      <button @click="saveProfile" class="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300">
        Guardar Cambios
      </button>

      <button @click="logout" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../plugins/axios'

const user = ref({ username: 'Cargando...', email: 'Cargando...', imagen: null })
const router = useRouter()

const loadUserProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  const { data } = await axios.get('/api/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  })

  user.value = { username: data.user.username, email: data.user.email, imagen: data.user.imagen }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('imagen', file)
    formData.append('username', user.value.username)
    formData.append('email', user.value.email)

    const token = localStorage.getItem('token')

    axios.put('/api/auth/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      loadUserProfile();
      alert('Imagen de perfil actualizada correctamente')
    })
    .catch(error => {
      console.error('Error al cargar la imagen de perfil', error)
      alert('Error al actualizar la imagen de perfil')
    })
  }
}

const saveProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  await axios.post('/api/auth/profile', user.value, {
    headers: { Authorization: `Bearer ${token}` }
  })

  alert('Perfil actualizado correctamente')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(loadUserProfile)

</script>
