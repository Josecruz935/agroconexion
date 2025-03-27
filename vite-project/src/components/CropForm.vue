<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 class="text-2xl font-bold mb-6 text-center text-green-600">
                {{ isEditing ? 'Editar Cultivo' : 'Nuevo Cultivo' }}
              </h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Nombre del Cultivo
                  </label>
                  <input
                    id="name"
                    v-model="cropData.name"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div class="space-y-2">
                  <label for="plantingDate" class="block text-sm font-medium text-gray-700">
                    Fecha de Siembra
                  </label>
                  <input
                    id="plantingDate"
                    v-model="cropData.plantingDate"
                    type="date"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div class="space-y-2">
                  <label for="estimatedHarvestDate" class="block text-sm font-medium text-gray-700">
                    Fecha Estimada de Cosecha
                  </label>
                  <input
                    id="estimatedHarvestDate"
                    v-model="cropData.estimatedHarvestDate"
                    type="date"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div class="space-y-2">
                  <label for="status" class="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="status"
                    v-model="cropData.status"
                    required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Plantado">Plantado</option>
                    <option value="En Crecimiento">En Crecimiento</option>
                    <option value="Listo para Cosechar">Listo para Cosechar</option>
                    <option value="Cosechado">Cosechado</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label for="notes" class="block text-sm font-medium text-gray-700">
                    Notas
                  </label>
                  <textarea
                    id="notes"
                    v-model="cropData.notes"
                    rows="3"
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>

                <div class="flex justify-end space-x-4">
                  <button
                    type="button"
                    @click="$router.push('/crops')"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {{ isEditing ? 'Actualizar' : 'Crear' }}
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import axiosInstance from '../plugins/axios'

const router = useRouter()
const route = useRoute()
const isEditing = ref(false)

const cropData = ref({
  name: '',
  plantingDate: '',
  estimatedHarvestDate: '',
  status: 'Plantado',
  notes: ''
})

onMounted(async () => {
  if (route.params.id) {
    isEditing.value = true
    try {
      const response = await axiosInstance.get(`/api/crops/${route.params.id}`)
      cropData.value = {
        ...response.data,
        plantingDate: response.data.plantingDate.split('T')[0],
        estimatedHarvestDate: response.data.estimatedHarvestDate.split('T')[0]
      }
    } catch (error) {
      console.error('Error al cargar el cultivo:', error)
      alert('Error al cargar el cultivo')
      router.push('/crops')
    }
  }
})

const handleSubmit = async () => {
  try {
    const formattedData = {
      ...cropData.value,
      plantingDate: new Date(cropData.value.plantingDate).toISOString(),
      estimatedHarvestDate: new Date(cropData.value.estimatedHarvestDate).toISOString()
    }

    if (isEditing.value) {
      await axios.put(`/api/crop/${route.params.id}`, formattedData)
    } else {
      await axios.post('/api/crop/add', formattedData)
    }
    router.push('/crops')
  } catch (error) {
    console.error('Error al guardar el cultivo:', error)
    alert('Error al guardar el cultivo: ' + error.response?.data?.message || error.message)
  }
}
</script>
