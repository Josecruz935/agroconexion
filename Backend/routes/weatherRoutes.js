import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();

// Obtener ciudad por coordenadas
router.get('/location', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            throw new Error('API key no configurada');
        }

        if (!lat || !lon) {
            throw new Error('Latitud y longitud son requeridas');
        }

        const response = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );

        if (response.data && response.data[0]) {
            res.json({ city: response.data[0].name });
        } else {
            throw new Error('No se pudo obtener la ciudad');
        }
    } catch (error) {
        console.error('Error al obtener la ciudad:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            message: 'Error al obtener la ciudad',
            error: error.response?.data?.message || error.message
        });
    }
});

// Obtener el clima actual por ciudad
router.get('/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        console.log('Using API Key:', apiKey); // Para debug

        if (!apiKey) {
            throw new Error('API key no configurada');
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );
        
        // Transformar la respuesta para incluir solo los datos que necesitamos
        const weatherData = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: Math.round(response.data.main.temp),
            feels_like: Math.round(response.data.main.feels_like),
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            wind_speed: response.data.wind.speed,
            clouds: response.data.clouds.all,
            timestamp: response.data.dt * 1000 // Convertir a milisegundos
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error al obtener el clima:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            message: 'Error al obtener datos del clima',
            error: error.response?.data?.message || error.message
        });
    }
});

// Obtener el pronóstico a 5 días por ciudad
router.get('/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;
        
        if (!apiKey) {
            throw new Error('API key no configurada');
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );

        // Transformar y agrupar el pronóstico por día
        const forecasts = response.data.list.reduce((days, item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            
            if (!days[date]) {
                days[date] = {
                    date: item.dt * 1000,
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    humidity: item.main.humidity,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                };
            } else {
                days[date].temp_min = Math.min(days[date].temp_min, item.main.temp_min);
                days[date].temp_max = Math.max(days[date].temp_max, item.main.temp_max);
            }
            
            return days;
        }, {});

        res.json({
            city: response.data.city.name,
            country: response.data.city.country,
            forecast: Object.values(forecasts)
        });
    } catch (error) {
        console.error('Error al obtener el pronóstico:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            message: 'Error al obtener el pronóstico del clima',
            error: error.response?.data?.message || error.message
        });
    }
});

export default router;
