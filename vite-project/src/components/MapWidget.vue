<template>
  <div class="relative">
    <!-- Estado de error -->
    <div v-if="error" class="w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      <div class="text-center p-6">
        <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <p class="text-gray-700 mb-4">{{ error }}</p>
        <button
          @click="initMap"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div v-else ref="mapContainer" class="w-full h-96 rounded-lg overflow-hidden">
      <!-- Loading state -->
      <div v-if="loading" class="w-full h-full bg-gray-100 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      </div>
    </div>

    <!-- Controles -->
    <div v-if="!error && !loading && !readonly" class="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2 z-[1000]">
      <button
        @click="toggleDrawing"
        class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full text-sm flex items-center justify-center gap-2"
      >
        <i :class="isDrawing ? 'fas fa-stop' : 'fas fa-draw-polygon'"></i>
        {{ isDrawing ? 'Detener' : 'Dibujar Parcela' }}
      </button>
      
      <button
        v-if="hasPolygon"
        @click="savePolygon"
        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-sm flex items-center justify-center gap-2"
      >
        <i class="fas fa-save"></i>
        Guardar Parcela
      </button>
    </div>

    <!-- Información del área -->
    <div v-if="area > 0 && !error" class="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
      <p class="text-sm font-medium">
        Área: {{ (area / 10000).toFixed(2) }} hectáreas
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'

// Arreglar los íconos de Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})

const props = defineProps({
  center: {
    type: Object,
    default: () => ({ lat: 15.5, lng: -88.0 }) // Centro aproximado de Honduras
  },
  zoom: {
    type: Number,
    default: 15
  },
  readonly: {
    type: Boolean,
    default: false
  },
  initialCoordinates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['polygonCreated'])

const mapContainer = ref(null)
const map = ref(null)
const isDrawing = ref(false)
const area = ref(0)
const error = ref(null)
const loading = ref(true)
const hasPolygon = ref(false)
let currentLayer = null

// Función para calcular el área
const calculateArea = (layer) => {
  return L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
}

// Función para inicializar el mapa
const initMap = async () => {
  loading.value = true
  error.value = null

  try {
    // Crear el mapa
    map.value = L.map(mapContainer.value).setView([props.center.lat, props.center.lng], props.zoom)

    // Agregar capa de satélite
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map.value)

    // Inicializar Geoman
    map.value.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    })

    // Eventos para el dibujo
    map.value.on('pm:create', (e) => {
      if (currentLayer) {
        map.value.removeLayer(currentLayer)
      }
      currentLayer = e.layer
      area.value = calculateArea(currentLayer)
      hasPolygon.value = true
      isDrawing.value = false

      // Eventos para edición
      currentLayer.on('pm:edit', (e) => {
        area.value = calculateArea(e.target)
      })
    })

    // Si es modo de solo lectura, deshabilitar el zoom y el arrastre
    if (props.readonly) {
      map.value.dragging.disable()
      map.value.touchZoom.disable()
      map.value.doubleClickZoom.disable()
      map.value.scrollWheelZoom.disable()
    }

    // Si hay coordenadas iniciales, mostrar el polígono
    if (props.initialCoordinates && props.initialCoordinates.length > 0) {
      const coordinates = props.initialCoordinates.map(coord => [coord.lat, coord.lng])
      currentLayer = L.polygon(coordinates, {
        color: '#4CAF50',
        fillColor: '#4CAF50',
        fillOpacity: 0.2
      }).addTo(map.value)

      // Ajustar la vista al polígono
      map.value.fitBounds(currentLayer.getBounds(), { padding: [50, 50] })
    }

    loading.value = false
  } catch (error) {
    console.error('Error al inicializar el mapa:', error)
    error.value = 'Error al cargar el mapa. Por favor, intenta de nuevo.'
    loading.value = false
  }
}

// Función para activar/desactivar el modo dibujo
const toggleDrawing = () => {
  if (!map.value) return

  if (isDrawing.value) {
    map.value.pm.disableDraw('Polygon')
  } else {
    map.value.pm.enableDraw('Polygon', {
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      templineStyle: {
        color: '#4CAF50'
      },
      hintlineStyle: {
        color: '#4CAF50',
        dashArray: [5, 5]
      },
      pathOptions: {
        color: '#4CAF50',
        fillColor: '#4CAF50',
        fillOpacity: 0.3
      }
    })
  }
  isDrawing.value = !isDrawing.value
}

// Función para guardar el polígono
const savePolygon = () => {
  if (!currentLayer) return

  const coordinates = currentLayer.getLatLngs()[0].map(latLng => ({
    lat: latLng.lat,
    lng: latLng.lng
  }))

  emit('polygonCreated', {
    coordinates,
    area: area.value
  })
}

// Inicializar el mapa cuando el componente se monta
onMounted(() => {
  initMap()
})

// Observar cambios en el centro del mapa
watch(() => props.center, (newCenter) => {
  if (map.value) {
    map.value.setView([newCenter.lat, newCenter.lng], props.zoom)
  }
}, { deep: true })

// Observar cambios en las coordenadas iniciales
watch(() => props.initialCoordinates, (newCoords) => {
  if (map.value && newCoords && newCoords.length > 0) {
    if (currentLayer) {
      map.value.removeLayer(currentLayer)
    }
    const coordinates = newCoords.map(coord => [coord.lat, coord.lng])
    currentLayer = L.polygon(coordinates, {
      color: '#4CAF50',
      fillColor: '#4CAF50',
      fillOpacity: 0.2
    }).addTo(map.value)
    map.value.fitBounds(currentLayer.getBounds(), { padding: [50, 50] })
  }
}, { deep: true })
</script>

<style>
.leaflet-control-container .leaflet-top {
  z-index: 999 !important;
}
.leaflet-control-container .leaflet-bottom {
  z-index: 999 !important;
}
</style>
