import axios from 'axios'
const baseURL = 'http://192.168.100.34:5000/api'

const dermatologiaApi = axios.create({baseURL});
//Middleware para interceptar las respuestas

export default dermatologiaApi;