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

// Anexa o token (se existir) para autenticação via DRF TokenAuth
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
  } catch (_) {
    // ignore
  }
  return config;
});

// Tratamento simples de 401 para feedback (opcional: redirecionar para login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // eslint-disable-next-line no-console
      console.warn('Não autorizado. Verifique o token de autenticação.');
    }
    return Promise.reject(err);
  }
);

export default api;
