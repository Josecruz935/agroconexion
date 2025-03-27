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

      <!-- Formulario -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-2xl font-bold leading-6 text-gray-900">
            {{ isEditing ? 'Editar Cultivo' : 'Nuevo Cultivo' }}
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ isEditing ? 'Modifica los detalles de tu cultivo' : 'Ingresa los detalles de tu nuevo cultivo' }}
          </p>
        </div>

        <div class="border-t border-gray-200">
          <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
            <!-- Nombre del cultivo -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nombre del Cultivo</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <!-- Tipo de cultivo -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Tipo de Cultivo</label>
              <select
                id="type"
                v-model="formData.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="">Selecciona un tipo</option>
                <option value="Granos">Granos</option>
                <option value="Hortalizas">Hortalizas</option>
                <option value="Frutales">Frutales</option>
                <option value="Legumbres">Legumbres</option>
                <option value="Tubérculos">Tubérculos</option>
              </select>
            </div>

            <!-- Estado del cultivo -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Estado del Cultivo</label>
              <select
                id="status"
                v-model="formData.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="">Selecciona un estado</option>
                <option value="Plantado">Plantado</option>
                <option value="En Crecimiento">En Crecimiento</option>
                <option value="Listo para Cosechar">Listo para Cosechar</option>
                <option value="Cosechado">Cosechado</option>
              </select>
            </div>

            <!-- Fecha de siembra -->
            <div>
              <label for="plantingDate" class="block text-sm font-medium text-gray-700">Fecha de Siembra</label>
              <input
                type="date"
                id="plantingDate"
                v-model="formData.plantingDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <!-- Fecha estimada de cosecha -->
            <div>
              <label for="estimatedHarvestDate" class="block text-sm font-medium text-gray-700">Fecha Estimada de Cosecha</label>
              <input
                type="date"
                id="estimatedHarvestDate"
                v-model="formData.estimatedHarvestDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <!-- Notas -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700">Notas Adicionales</label>
              <textarea
                id="notes"
                v-model="formData.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Agrega notas o comentarios sobre el cultivo..."
              ></textarea>
            </div>

            <!-- Mapa para dibujar parcela -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parcela</label>
              <MapWidget
                @polygon-created="handlePolygonCreated"
                :initial-coordinates="formData.parcel.coordinates"
              />
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="$router.push('/crops')"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {{ isEditing ? 'Guardar Cambios' : 'Crear Cultivo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios'
import MapWidget from '../components/MapWidget.vue'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => route.params.id !== undefined)

const formData = ref({
  name: '',
  type: '',
  plantingDate: '',
  estimatedHarvestDate: '',
  status: 'Plantado',
  notes: '',
  parcel: {
    coordinates: [],
    area: 0
  }
})

const handlePolygonCreated = (polygon) => {
  formData.value.parcel = {
    coordinates: polygon.coordinates,
    area: polygon.area
  }
}

const loadCrop = async () => {
  if (!isEditing.value) return

  try {
    const response = await axios.get(`/api/crops/${route.params.id}`)
    const crop = response.data

    formData.value = {
      name: crop.name,
      type: crop.type,
      plantingDate: crop.plantingDate.split('T')[0],
      estimatedHarvestDate: crop.estimatedHarvestDate.split('T')[0],
      status: crop.status,
      notes: crop.notes || '',
      parcel: crop.parcel || {
        coordinates: [],
        area: 0
      }
    }
  } catch (error) {
    console.error('Error al cargar el cultivo:', error)
    alert('Error al cargar el cultivo. Por favor, intenta de nuevo.')
    router.push('/crops')
  }
}

const handleSubmit = async () => {
  try {
    const cropData = {
      ...formData.value,
      plantingDate: new Date(formData.value.plantingDate).toISOString(),
      estimatedHarvestDate: new Date(formData.value.estimatedHarvestDate).toISOString()
    }

    if (isEditing.value) {
      await axios.put(`/api/crops/${route.params.id}`, cropData)
    } else {
      await axios.post('/api/crops', cropData)
    }
    router.push('/crops')
  } catch (error) {
    console.error('Error:', error)
    alert('Error al guardar el cultivo. Por favor, intenta de nuevo.')
  }
}

onMounted(() => {
  loadCrop()
})
</script>
