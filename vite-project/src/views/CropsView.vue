<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Mis Cultivos</h1>
        <router-link
          to="/crops/new"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <i class="fas fa-plus mr-2"></i>
          Nuevo Cultivo
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Cargando cultivos...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="rounded-full bg-red-100 p-3 mx-auto w-12 h-12 flex items-center justify-center">
          <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error al cargar los cultivos</h3>
        <p class="mt-1 text-sm text-red-500">{{ error }}</p>
        <div class="mt-6">
          <button
            @click="loadCrops"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <i class="fas fa-sync mr-2"></i>
            Reintentar
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="crops.length === 0" class="text-center py-12">
        <div class="rounded-full bg-green-100 p-3 mx-auto w-12 h-12 flex items-center justify-center">
          <i class="fas fa-seedling text-green-600 text-xl"></i>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay cultivos</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer cultivo</p>
        <div class="mt-6">
          <router-link
            to="/crops/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <i class="fas fa-plus mr-2"></i>
            Nuevo Cultivo
          </router-link>
        </div>
      </div>

      <!-- Lista de cultivos -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="crop in crops"
          :key="crop._id"
          class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div class="p-5">
            <!-- Encabezado -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ crop.name }}</h3>
                <p class="text-sm text-gray-500">{{ crop.type }}</p>
              </div>
              <span
                :class="getStatusClass(crop.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ crop.status }}
              </span>
            </div>

            <!-- Detalles -->
            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-calendar mr-2"></i>
                <span>Sembrado: {{ formatDate(crop.plantingDate) }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-clock mr-2"></i>
                <span>Cosecha: {{ formatDate(crop.estimatedHarvestDate) }}</span>
              </div>
              <div v-if="crop.parcel" class="space-y-2">
                <div class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-ruler mr-2"></i>
                  <span>Área: {{ (crop.parcel.area / 10000).toFixed(2) }} hectáreas</span>
                </div>
                <!-- Mini mapa -->
                <div class="h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <MapWidget
                    :initial-coordinates="crop.parcel.coordinates"
                    :readonly="true"
                    class="h-full w-full"
                  />
                </div>
              </div>
              <div v-if="crop.notes" class="text-sm text-gray-500">
                <i class="fas fa-sticky-note mr-2"></i>
                <span>{{ crop.notes }}</span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-4 flex justify-end space-x-3">
              <button
                @click="deleteCrop(crop._id)"
                class="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <i class="fas fa-trash mr-1"></i>
                Eliminar
              </button>
              <router-link
                :to="`/crops/${crop._id}/edit`"
                class="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <i class="fas fa-edit mr-1"></i>
                Editar
              </router-link>
              <router-link
                :to="`/crops/${crop._id}`"
                class="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-eye mr-1"></i>
                Ver
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../plugins/axios'
import axiosInstance from '../plugins/axios'
import MapWidget from '../components/MapWidget.vue'

const crops = ref([])
const loading = ref(true)
const error = ref(null)

// Cargar cultivos
const loadCrops = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axiosInstance.get('/api/crops')
    crops.value = response.data
  } catch (err) {
    console.error('Error al cargar cultivos:', err)
    error.value = 'Error al cargar los cultivos. Por favor, intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

// Eliminar cultivo
const deleteCrop = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este cultivo?')) return

  try {
    await axios.delete(`/api/crops/${id}`)
    crops.value = crops.value.filter(crop => crop._id !== id)
  } catch (error) {
    console.error('Error al eliminar cultivo:', error)
    alert('Error al eliminar el cultivo. Por favor, intenta de nuevo.')
  }
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'No especificada'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Obtener clase CSS según el estado
const getStatusClass = (status) => {
  const classes = {
    'Plantado': 'bg-blue-100 text-blue-800',
    'En Crecimiento': 'bg-green-100 text-green-800',
    'Listo para Cosechar': 'bg-yellow-100 text-yellow-800',
    'Cosechado': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  loadCrops()
})
</script>
