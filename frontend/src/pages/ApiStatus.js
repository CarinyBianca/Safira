import React, { useEffect, useState } from 'react';
import api from '../api/client';

function ApiStatus() {
  const [apiStatus, setApiStatus] = useState({ loading: false, ok: false, message: '' });

  useEffect(() => {
    const testApi = async () => {
      setApiStatus({ loading: true, ok: false, message: '' });
      try {
        const res = await api.get('health/');
        const status = res.data?.status || 'desconhecido';
        setApiStatus({ loading: false, ok: true, message: `Conectado. Status: ${status}` });
      } catch (err) {
        const msg = err?.response?.status
          ? `Erro ${err.response.status} ao conectar em /api/health/`
          : 'Não foi possível alcançar a API (backend está rodando?)';
        setApiStatus({ loading: false, ok: false, message: msg });
      }
    };
    testApi();
  }, []);

  return (
    <div>
      <h2>Status da API</h2>
      {apiStatus.loading ? (
        <p>Verificando conexão...</p>
      ) : (
        <p style={{ color: apiStatus.ok ? '#16a34a' : '#dc2626' }}>{apiStatus.message}</p>
      )}
      <p style={{ fontSize: 12, color: '#6b7280' }}>Endpoint testado: /api/health/</p>
    </div>
  );
}

export default ApiStatus;
