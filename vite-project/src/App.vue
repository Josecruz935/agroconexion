<template>
  <!-- Navbar -->
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y Título -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img class="h-10 w-10" src="@/assets/logo.svg" alt="AgroSync Logo" />
            <span class="ml-2 text-2xl font-bold text-green-600">AgroSync</span>
          </router-link>
        </div>

        <!-- Menú de navegación -->
        <div class="hidden sm:flex sm:items-center sm:ml-6">
          <div class="flex space-x-4">
            <router-link
              to="/"
              class="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-green-600': $route.path === '/' }"
            >
              Inicio
            </router-link>
            <router-link
              to="/crops"
              class="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-green-600': $route.path.includes('/crops') }"
            >
              Mis Cultivos
            </router-link>

            <router-link
            to="/reportar-plagas"
            class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-red-600': $route.path === '/reportar-plagas' }"
          >
          Plagas
          </router-link>

          <router-link
          to="/Foro"
          class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          :class="{ 'text-blue-600': $route.path === '/Foro' }"
        >
          Foro
        </router-link>

        <router-link
          to="/calendario-riego"
          class="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
          :class="{ 'text-green-600': $route.path === '/calendario-riego' }"
        >
        🌾Riego y Fertilización
        </router-link>
         

        <router-link
          to="/marketplace"
          class="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
          :class="{ 'text-green-600': $route.path === '/marketplace' }"
        >
        🌾Markeplace 
        </router-link>

          </div>
        </div>

        <!-- Menú de usuario -->
        <div class="flex items-center">
          <div class="ml-3 relative" v-if="isAuthenticated">
            <div class="relative" @click="toggleUserMenu" ref="userMenuButton">
              <button
                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
              <span class="sr-only">Abrir menú de usuario</span>
              <div class="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center overflow-hidden">
    <img v-if="user.imagen" :src="`http://localhost:5000${user.imagen}`" alt="Foto de perfil" 
      class="h-full w-full object-cover"
    />
    <span v-else class="text-2xl text-white">👤</span>
  </div>
              </button>
            </div>

            <!-- Menú desplegable -->
            <div
              v-if="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
            >
            <router-link
              to="/profile/:id"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Mi Perfil
            </router-link>

              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          <div v-else class="flex space-x-4">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Registrarse
            </router-link>

          </div>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <div class="sm:hidden" v-if="isAuthenticated">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-gray-50"
          :class="{ 'text-green-600 bg-gray-50': $route.path === '/' }"
        >
          Inicio
        </router-link>
        <router-link
          to="/crops"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-gray-50"
          :class="{ 'text-green-600 bg-gray-50': $route.path.includes('/crops') }"
        >
          Mis Cultivos
        </router-link>
        <router-link
      to="/reportar-plagas"
      class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
      :class="{ 'text-red-600': $route.path === '/reportar-plagas' }"
    >
      Plagas
    </router-link>
      </div>
    </div>
  </nav>

  <!-- Contenido principal -->
  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <router-view></router-view>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
const user = ref({ imagen: null }) // Solo manejamos la imagen aquí
const router = useRouter()
const showUserMenu = ref(false)
const userMenuButton = ref(null)
const isAuthenticated = computed(() => !!localStorage.getItem('token'))

// Calcular iniciales del usuario
const userInitials = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.name) {
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  return 'U'
})

// Alternar menú de usuario
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event) => {
  if (userMenuButton.value && !userMenuButton.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
