import axios from 'axios';

// Base URL para desenvolvimento usando o proxy do CRA
// Em produção, você pode definir REACT_APP_API_BASE_URL no ambiente
const baseURL = process.env.REACT_APP_API_BASE_URL || '/api/';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
