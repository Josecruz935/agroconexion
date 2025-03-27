<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 class="text-2xl font-bold mb-6 text-center text-green-600">Detalles del Cultivo</h2>
              
              <div v-if="crop" class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="font-medium">Nombre:</span>
                  <span>{{ crop.name }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="font-medium">Fecha de Siembra:</span>
                  <span>{{ formatDate(crop.plantingDate) }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="font-medium">Fecha Estimada de Cosecha:</span>
                  <span>{{ formatDate(crop.estimatedHarvestDate) }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="font-medium">Estado:</span>
                  <span :class="getStatusClass(crop.status)">{{ crop.status }}</span>
                </div>
                
                <div class="mt-6 space-y-2">
                  <h3 class="font-medium">Notas:</h3>
                  <p class="text-gray-600">{{ crop.notes || 'Sin notas' }}</p>
                </div>
                
                <div class="flex justify-end space-x-4 mt-8">
                  <button @click="editCrop" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Editar
                  </button>
                  <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div v-else class="text-center text-gray-500">
                Cargando detalles del cultivo...
              </div>
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

const router = useRouter()
const route = useRoute()
const crop = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    'Plantado': 'text-green-600',
    'En Crecimiento': 'text-blue-600',
    'Listo para Cosechar': 'text-yellow-600',
    'Cosechado': 'text-gray-600'
  }
  return classes[status] || 'text-gray-600'
}

const editCrop = () => {
  router.push(`/crops/edit/${route.params.id}`)
}

const confirmDelete = async () => {
  if (confirm('¿Estás seguro de que deseas eliminar este cultivo?')) {
    try {
      await axios.delete(`/api/crops/${route.params.id}`)
      router.push('/crops')
    } catch (error) {
      console.error('Error al eliminar el cultivo:', error)
      alert('Error al eliminar el cultivo')
    }
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(`/api/crops/${route.params.id}`)
    crop.value = response.data
  } catch (error) {
    console.error('Error al cargar el cultivo:', error)
    alert('Error al cargar los detalles del cultivo')
  }
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f7fafc;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.sm\:py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.relative {
  position: relative;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.sm\:max-w-xl {
  max-width: 36rem;
}

.sm\:mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.bg-white {
  background-color: #ffffff;
}

.mx-8 {
  margin-left: 2rem;
  margin-right: 2rem;
}

.md\:mx-0 {
  margin-left: 0;
  margin-right: 0;
}

.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.rounded-3xl {
  border-radius: 1.5rem;
}

.sm\:p-10 {
  padding: 2.5rem;
}

.max-w-md {
  max-width: 28rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.divide-y {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #e5e7eb;
}

.divide-gray-200 {
  border-top-color: #e5e7eb;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.text-base {
  font-size: 1rem;
}

.leading-6 {
  line-height: 1.5rem;
}

.space-y-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.text-gray-700 {
  color: #4a5568;
}

.sm\:text-lg {
  font-size: 1.125rem;
}

.sm\:leading-7 {
  line-height: 1.75rem;
}

.font-medium {
  font-weight: 500;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.text-center {
  text-align: center;
}

.text-green-600 {
  color: #34c759;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.font-medium {
  font-weight: 500;
}

.text-gray-600 {
  color: #718096;
}

.mt-6 {
  margin-top: 1.5rem;
}

.space-y-2 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.font-medium {
  font-weight: 500;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.space-x-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}

.mt-8 {
  margin-top: 2rem;
}

.bg-blue-500 {
  background-color: #3498db;
}

.text-white {
  color: #ffffff;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.hover\:bg-blue-600 {
  background-color: #2e6da4;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.bg-red-500 {
  background-color: #e74c3c;
}

.hover\:bg-red-600 {
  background-color: #c0392b;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.text-gray-500 {
  color: #a0aec0;
}
</style>
