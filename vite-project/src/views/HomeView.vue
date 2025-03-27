<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl font-bold text-green-600 mb-6">
          Bienvenido a AgroSync
        </h1>
        <p class="text-xl text-gray-600 mb-12">
          Tu plataforma integral para la gestión y seguimiento de cultivos
        </p>

        <div v-if="!isAuthenticated" class="space-y-6">
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <router-link
              to="/login"
              class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="inline-flex items-center justify-center px-6 py-3 border border-green-600 rounded-md shadow-sm text-base font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <i class="fas fa-user-plus mr-2"></i>
              Registrarse
            </router-link>
          </div>
        </div>

        <div v-else class="space-y-6">
          <router-link
            to="/crops"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <i class="fas fa-seedling mr-2"></i>
            Ver Mis Cultivos
          </router-link>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="text-green-600 text-4xl mb-4">
              <i class="fas fa-seedling"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Gestión de Cultivos
            </h3>
            <p class="text-gray-600">
              Registra y monitorea tus cultivos de manera eficiente con herramientas avanzadas de seguimiento.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="text-green-600 text-4xl mb-4">
              <i class="fas fa-map-marked-alt"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Mapeo de Parcelas
            </h3>
            <p class="text-gray-600">
              Visualiza y administra tus parcelas con nuestro sistema integrado de mapeo y medición de áreas.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="text-green-600 text-4xl mb-4">
              <i class="fas fa-cloud-sun"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              Información Climática
            </h3>
            <p class="text-gray-600">
              Accede a datos meteorológicos en tiempo real para tomar mejores decisiones en tus cultivos.
            </p>
          </div>
        </div>

        <!-- Sección de características adicionales -->
        <div class="mt-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">
            ¿Por qué elegir AgroSync?
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div class="flex items-center mb-4">
                <div class="bg-green-100 rounded-full p-3">
                  <i class="fas fa-mobile-alt text-green-600 text-xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 ml-4">
                  Acceso Móvil
                </h3>
              </div>
              <p class="text-gray-600">
                Gestiona tus cultivos desde cualquier lugar con nuestra interfaz adaptativa.
              </p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div class="flex items-center mb-4">
                <div class="bg-green-100 rounded-full p-3">
                  <i class="fas fa-chart-line text-green-600 text-xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 ml-4">
                  Análisis Detallado
                </h3>
              </div>
              <p class="text-gray-600">
                Obtén insights valiosos sobre el rendimiento de tus cultivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token')
})
</script>
