<template>
  <div class="min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900 text-white p-6">
    <!-- Clima Local -->
    <div class="mb-8">
      <h3 class="text-3xl font-semibold text-yellow-400 mb-4 drop-shadow-lg">Clima Local</h3>
      <WeatherWidget />
    </div>

    <!-- Calendario de Riego y Fertilización -->
    <div class="max-w-3xl mx-auto bg-black/30 p-6 rounded-xl shadow-lg backdrop-blur-md">
      <h2 class="text-3xl font-bold text-center mb-4">🚀 Calendario de Riego y Fertilización</h2>

      <!-- Selección del cultivo -->
      <select v-model="selectedCrop" class="w-full p-2 rounded-lg bg-gray-800 text-white" @change="updateSelectedCropName">
        <option v-for="crop in crops" :key="crop._id" :value="crop._id">
          {{ crop.name }}
        </option>
      </select>

      <div v-if="selectedCrop" class="mt-6">
        <h3 class="text-xl font-semibold mb-2">🌱 Selecciona las fechas para {{ selectedCropName }}</h3>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm">Riego:</label>
            <input type="date" v-model="irrigationDate" class="w-full p-2 rounded bg-gray-700">
            <button @click="addIrrigationDate" class="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded">Agregar Riego</button>
          </div>

          <div>
            <label class="block text-sm">Fertilización:</label>
            <input type="date" v-model="fertilizationDate" class="w-full p-2 rounded bg-gray-700">
            <button @click="addFertilizationDate" class="mt-2 w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded">Agregar Fertilización</button>
          </div>
        </div>

        <!-- Mostrar fechas guardadas con el nombre del cultivo -->
        <div v-if="selectedCropSchedule" class="mt-6">
          <h3 class="text-lg font-semibold">📅 Fechas Programadas para {{ selectedCropName }}:</h3>

          <div class="mt-3 p-4 bg-gray-800/70 rounded-lg shadow">
            <h4 class="text-blue-400 font-semibold">💧 Fechas de Riego:</h4>
            <ul v-if="selectedCropSchedule.irrigationDates.length" class="list-disc ml-5">
              <li v-for="(date, index) in selectedCropSchedule.irrigationDates" :key="index">
                {{ date }}
                <button @click="deleteDate('irrigation', index)" class="ml-2 text-red-500">Eliminar</button>
              </li>
            </ul>
            <p v-else class="text-gray-400">No hay fechas de riego agregadas.</p>

            <h4 class="text-green-400 font-semibold mt-3">🌿 Fechas de Fertilización:</h4>
            <ul v-if="selectedCropSchedule.fertilizationDates.length" class="list-disc ml-5">
              <li v-for="(date, index) in selectedCropSchedule.fertilizationDates" :key="index">
                {{ date }}
                <button @click="deleteDate('fertilization', index)" class="ml-2 text-red-500">Eliminar</button>
              </li>
            </ul>
            <p v-else class="text-gray-400">No hay fechas de fertilización agregadas.</p>
          </div>
        </div>

        <!-- Botón para cargar las fechas guardadas desde la base de datos -->
        <button @click="loadSavedSchedule" class="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold shadow-lg">Cargar Fechas Guardadas</button>

        <!-- Botón para guardar las fechas -->
        <button @click="saveSchedule" class="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl font-bold shadow-lg">🚀 Guardar</button>
      </div>
    </div>
  </div>
</template>
 

<script>
import axios from '../plugins/axios'
import WeatherWidget from '../components/WeatherWidget.vue'

export default {
  data() {
    return {
      crops: [],
      selectedCrop: null,
      selectedCropName: '',
      irrigationDate: '',
      fertilizationDate: '',
      cropSchedules: {}  // Almacenará los calendarios por cultivo
    };
  },
  async mounted() {
    const res = await axios.get('/api/crops', {
      headers: { Authorization: localStorage.getItem('token') }
    });
    this.crops = res.data;
  },
  computed: {
    selectedCropSchedule() {
      return this.cropSchedules[this.selectedCrop] || { irrigationDates: [], fertilizationDates: [] };
    }
  },
  methods: {
    updateSelectedCropName() {
      const crop = this.crops.find(c => c._id === this.selectedCrop);
      this.selectedCropName = crop ? crop.name : '';
    },
    addIrrigationDate() {
      if (this.irrigationDate) {
        this.selectedCropSchedule.irrigationDates.push(this.irrigationDate);
        this.irrigationDate = '';
      }
    },
    addFertilizationDate() {
      if (this.fertilizationDate) {
        this.selectedCropSchedule.fertilizationDates.push(this.fertilizationDate);
        this.fertilizationDate = '';
      }
    },
    async saveSchedule() {
      if (!this.selectedCrop) {
        console.error("❌ No hay cultivo seleccionado");
        return;
      }

      try {
        const response = await axios.post(
          `/api/calendario-riego/${this.selectedCrop}`,
          {
            irrigationDates: this.selectedCropSchedule.irrigationDates,
            fertilizationDates: this.selectedCropSchedule.fertilizationDates
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        console.log("✅ Fechas guardadas:", response.data);
        alert("Fechas guardadas correctamente");

        // Actualizar las fechas del cultivo en el objeto
        this.cropSchedules[this.selectedCrop] = response.data;
      } catch (error) {
        console.error("❌ Error en POST:", error.response ? error.response.data : error.message);
      }
    },
    async loadSavedSchedule() {
      if (!this.selectedCrop) {
        console.error("❌ No hay cultivo seleccionado");
        return;
      }

      try {
        const response = await axios.get(`/api/calendario-riego/${this.selectedCrop}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log("✅ Fechas cargadas:", response.data);

        // Almacenar las fechas en el objeto de calendarios
        this.cropSchedules[this.selectedCrop] = response.data;
      } catch (error) {
        console.error("❌ Error al cargar las fechas:", error.response ? error.response.data : error.message);
      }
    },
    async deleteDate(type, index) {
      if (!this.selectedCrop) {
        console.error("❌ No hay cultivo seleccionado");
        return;
      }

      const dateToDelete = type === 'irrigation' ? this.selectedCropSchedule.irrigationDates[index] : this.selectedCropSchedule.fertilizationDates[index];
      const confirmation = confirm(`¿Estás seguro de que deseas eliminar la fecha ${dateToDelete}?`);

      if (!confirmation) return;

      try {
        const response = await axios.delete(`/api/calendario-riego/${this.selectedCrop}/${type}`, {
          data: { date: dateToDelete },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        console.log("✅ Fecha eliminada:", response.data);

        // Actualizar las fechas después de eliminar
        if (type === 'irrigation') {
          this.selectedCropSchedule.irrigationDates.splice(index, 1);
        } else {
          this.selectedCropSchedule.fertilizationDates.splice(index, 1);
        }
      } catch (error) {
        console.error("❌ Error al eliminar la fecha:", error.response ? error.response.data : error.message);
      }
    }
  },
  components: {
    WeatherWidget
  }
};
</script>
