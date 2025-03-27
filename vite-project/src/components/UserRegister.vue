<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 class="text-2xl font-bold mb-6 text-center text-green-600">Registro de Usuario</h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Nombre Completo
                  </label>
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div class="space-y-2">
                  <label for="password" class="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-sm">
                    <router-link to="/login" class="font-medium text-green-600 hover:text-green-500">
                      ¿Ya tienes cuenta? Inicia sesión
                    </router-link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Registrarse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import axiosInstance from '../plugins/axios'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    localStorage.setItem('token', response.data.token)
    router.push('/crops')
  } catch (error) {
    console.error('Error de registro:', error)
    alert('Error al registrar el usuario. Por favor, intenta de nuevo.')
  }
}
</script>
