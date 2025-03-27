<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- Current Weather -->
    <div class="p-6">
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-500 mb-2">{{ error }}</div>
        <button
          @click="loadWeather"
          class="text-green-600 hover:text-green-700"
        >
          <i class="fas fa-sync-alt mr-1"></i>
          Reintentar
        </button>
      </div>

      <div v-else-if="weather" class="text-center">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">
          {{ weather.city }}, {{ weather.country }}
        </h2>
        
        <div class="flex justify-center items-center mb-4">
          <img 
            :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
            :alt="weather.description"
            class="w-16 h-16"
          />
          <div class="text-4xl font-bold text-gray-900">
            {{ weather.temperature }}°C
          </div>
        </div>

        <p class="text-gray-600 capitalize mb-4">
          {{ weather.description }}
        </p>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="text-gray-600">
            <i class="fas fa-thermometer-half text-yellow-500 mr-1"></i>
            Sensación térmica: {{ weather.feels_like }}°C
          </div>
          <div class="text-gray-600">
            <i class="fas fa-tint text-blue-500 mr-1"></i>
            Humedad: {{ weather.humidity }}%
          </div>
          <div class="text-gray-600">
            <i class="fas fa-wind text-gray-500 mr-1"></i>
            Viento: {{ weather.wind_speed }} m/s
          </div>
          <div class="text-gray-600">
            <i class="fas fa-cloud text-gray-400 mr-1"></i>
            Nubes: {{ weather.clouds }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Forecast -->
    <div v-if="forecast && !loading && !error" class="border-t border-gray-200">
      <div class="grid grid-cols-5 divide-x divide-gray-200">
        <div
          v-for="(day, index) in forecast"
          :key="index"
          class="p-3 text-center"
        >
          <div class="text-xs text-gray-500">
            {{ formatDate(day.date) }}
          </div>
          <img 
            :src="`https://openweathermap.org/img/wn/${day.icon}.png`"
            :alt="day.description"
            class="w-8 h-8 mx-auto"
          />
          <div class="text-sm">
            <span class="text-red-500">{{ Math.round(day.temp_max) }}°</span>
            <span class="text-gray-400 mx-1">/</span>
            <span class="text-blue-500">{{ Math.round(day.temp_min) }}°</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import axiosInstance from '../plugins/axios'

const props = defineProps({
  defaultCity: {
    type: String,
    default: 'Panama'
  }
})

const weather = ref(null)
const forecast = ref(null)
const loading = ref(true)
const error = ref(null)
const currentCity = ref(props.defaultCity)

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', { weekday: 'short' })
}

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada por tu navegador'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await axiosInstance.get(`/api/weather/location?lat=${latitude}&lon=${longitude}`)
          if (response.data && response.data.city) {
            currentCity.value = response.data.city
            resolve(response.data.city)
          } else {
            resolve(props.defaultCity)
          }
        } catch (err) {
          console.error('Error al obtener la ciudad:', err)
          resolve(props.defaultCity)
        }
      },
      (err) => {
        console.error('Error de geolocalización:', err)
        resolve(props.defaultCity)
      }
    )
  })
}

const loadWeather = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Intentar obtener la ubicación actual
    const city = await getCurrentLocation()
    
    // Cargar clima actual
    const weatherResponse = await axiosInstance.get(`/api/weather/${city}`)
    weather.value = weatherResponse.data

    // Cargar pronóstico
    const forecastResponse = await axiosInstance.get(`/api/weather/forecast/${city}`)
    forecast.value = forecastResponse.data.forecast
  } catch (err) {
    console.error('Error al cargar el clima:', err)
    error.value = err.response?.data?.message || 'Error al cargar el clima'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWeather()
})
</script>
