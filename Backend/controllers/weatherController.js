import axios from 'axios';

const getWeather = async (city) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=your_api_key`);
        return response.data;
    } catch (err) {
        console.error(err);
    }
};
// ES Modules
export default getWeather;

