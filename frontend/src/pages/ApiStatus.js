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
        <p className={apiStatus.ok ? 'text-success' : 'text-danger'}>{apiStatus.message}</p>
      )}
      <p className="text-muted" style={{ fontSize: 12 }}>Endpoint testado: /api/health/</p>
    </div>
  );
}

export default ApiStatus;
