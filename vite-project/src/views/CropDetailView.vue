<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Botón de regreso -->
      <div class="mb-8">
        <button
          @click="$router.push('/crops')"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Volver a Cultivos
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Cargando detalles del cultivo...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="rounded-full bg-red-100 p-3 mx-auto w-12 h-12 flex items-center justify-center">
          <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error al cargar el cultivo</h3>
        <p class="mt-1 text-sm text-red-500">{{ error }}</p>
        <div class="mt-6">
          <button
            @click="loadCrop"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <i class="fas fa-sync mr-2"></i>
            Reintentar
          </button>
        </div>
      </div>

      <!-- Crop details -->
      <div v-else-if="crop" class="space-y-8">
        <!-- Weather Widget -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Clima Local</h3>
          <WeatherWidget />
        </div>

        <!-- Map Widget -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ubicación y Parcela</h3>
          <MapWidget 
            :center="cropLocation"
            @polygon-created="handlePolygonCreated" 
          />
        </div>

        <!-- Crop Information -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-2xl font-bold leading-6 text-gray-900">{{ crop.name }}</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">Detalles del cultivo</p>
            </div>
            <button @click="editCrop" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Editar
                  </button>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Estado</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span :class="getStatusClass(crop.status)">{{ crop.status }}</span>
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Fecha de siembra</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatDate(crop.plantingDate) }}
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Fecha estimada de cosecha</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatDate(crop.estimatedHarvestDate) }}
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Días hasta la cosecha</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ getDaysUntilHarvest() }}
                </dd>
              </div>
              <div v-if="crop.irrigation" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Último riego</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatDate(crop.irrigation.lastDate) }}
                  <span v-if="crop.irrigation.frequency" class="text-gray-500 ml-2">
                    (Frecuencia: cada {{ crop.irrigation.frequency }} días)
                  </span>
                </dd>
              </div>
              <div v-if="crop.fertilization" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Fertilización</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div v-if="crop.fertilization.lastDate">
                    Última: {{ formatDate(crop.fertilization.lastDate) }}
                  </div>
                  <div v-if="crop.fertilization.nextDate" class="text-green-600">
                    Próxima: {{ formatDate(crop.fertilization.nextDate) }}
                  </div>
                  <div v-if="crop.fertilization.type" class="text-gray-500 mt-1">
                    Tipo: {{ crop.fertilization.type }}
                  </div>
                </dd>
              </div>
              <div v-if="crop.pests && crop.pests.length > 0" class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Plagas detectadas</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul class="divide-y divide-gray-200">
                    <li v-for="(pest, index) in crop.pests" :key="index" class="py-2">
                      <div class="font-medium">{{ pest.name }}</div>
                      <div class="text-gray-500">
                        Detectada: {{ formatDate(pest.detectedDate) }}
                      </div>
                      <div v-if="pest.treatment" class="text-gray-600 mt-1">
                        Tratamiento: {{ pest.treatment }}
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
              <div v-if="crop.notes" class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Notas</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                  {{ crop.notes }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import axiosInstance from '../plugins/axios'
import WeatherWidget from '../components/WeatherWidget.vue'
import MapWidget from '../components/MapWidget.vue'

const route = useRoute()
const router = useRouter()
const crop = ref(null)
const loading = ref(true)
const error = ref(null)
const cropLocation = ref({ lat: 15.5, lng: -88.0 }) // Centro aproximado de Honduras

const formatDate = (date) => {
  if (!date) return 'No definida'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    'Plantado': 'text-blue-600',
    'En Crecimiento': 'text-green-600',
    'Listo para Cosechar': 'text-yellow-600',
    'Cosechado': 'text-gray-600'
  }
  return classes[status] || 'text-gray-600'
}
const editCrop = () => {
  router.push(`/crops/edit/${route.params.id}`)
}

const getDaysUntilHarvest = () => {
  if (!crop.value?.estimatedHarvestDate) return 'No definido'
  
  const today = new Date()
  const harvestDate = new Date(crop.value.estimatedHarvestDate)
  const diffTime = harvestDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Cosecha atrasada'
  } else if (diffDays === 0) {
    return 'Hoy es el día de cosecha'
  } else {
    return `${diffDays} días`
  }
}

const loadCrop = async () => {
  loading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token')
    const response = await axiosInstance.get(`/api/crops/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    crop.value = response.data
    
    // Si el cultivo tiene una ubicación, la usamos
    if (crop.value.location) {
      cropLocation.value = crop.value.location
    }
  } catch (err) {
    console.error('Error al cargar el cultivo:', err)
    error.value = err.response?.data?.message || 'Error al cargar los detalles del cultivo'
  } finally {
    loading.value = false
  }
}

const handlePolygonCreated = async (polygon) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axiosInstance.put(
      `/api/crop/${route.params.id}`,
      {
        parcel: {
          coordinates: polygon.coordinates,
          area: polygon.area
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    crop.value = response.data
  } catch (error) {
    console.error('Error al guardar la parcela:', error)
  }
}

onMounted(() => {
  loadCrop()
})
</script>
