import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApiStatus() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function checkHealth() {
      try {
        const resp = await axios.get('/api/health/');
        if (!mounted) return;
        setStatus(resp.data || { ok: true });
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data || { error: 'Falha ao verificar API' });
      }
    }
    checkHealth();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Status da API</h2>
      {status && (
        <pre style={{ background: '#f6f8fa', padding: '12px', borderRadius: 6 }}>
{JSON.stringify(status, null, 2)}
        </pre>
      )}
      {error && (
        <pre style={{ background: '#fff5f5', padding: '12px', borderRadius: 6, color: '#b00020' }}>
{JSON.stringify(error, null, 2)}
        </pre>
      )}
      {!status && !error && <p>Verificando...</p>}
    </div>
  );
}

export default ApiStatus;
