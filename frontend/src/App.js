import React, { useEffect, useState } from 'react';
import Tabs from './components/Tabs';
import api from './api/client';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiStatus, setApiStatus] = useState({ loading: false, ok: false, message: '' });

  useEffect(() => {
    // Teste simples de conexão com a API
    const testApi = async () => {
      setApiStatus({ loading: true, ok: false, message: '' });
      try {
        const res = await api.get('projects/');
        const count = Array.isArray(res.data) ? res.data.length : (res.data?.results?.length ?? 0);
        setApiStatus({ loading: false, ok: true, message: `Conectado. Projetos retornados: ${count}` });
      } catch (err) {
        const msg = err?.response?.status
          ? `Erro ${err.response.status} ao conectar em /api/projects/`
          : 'Não foi possível alcançar a API (backend está rodando?)';
        setApiStatus({ loading: false, ok: false, message: msg });
      }
    };
    testApi();
  }, []);

  const tabs = [
    {
      key: 'overview',
      label: 'Início',
      content: (
        <div>
          <h1>Bem-vindo ao Gerenciador de Tarefas Safira!</h1>
          <p style={{ color: '#6b7280' }}>Use as abas para navegar entre seções.</p>
        </div>
      ),
    },
    {
      key: 'projects',
      label: 'Projetos',
      content: (
        <div>
          <h2>Projetos</h2>
          <p>Conteúdo de projetos vai aqui.</p>
        </div>
      ),
    },
    {
      key: 'tasks',
      label: 'Tarefas',
      content: (
        <div>
          <h2>Tarefas</h2>
          <p>Conteúdo de tarefas vai aqui.</p>
        </div>
      ),
    },
    {
      key: 'users',
      label: 'Usuários',
      content: (
        <div>
          <h2>Usuários</h2>
          <p>Conteúdo de usuários vai aqui.</p>
        </div>
      ),
    },
    {
      key: 'api',
      label: 'Status API',
      content: (
        <div>
          <h2>Status da API</h2>
          {apiStatus.loading ? (
            <p>Verificando conexão...</p>
          ) : (
            <p style={{ color: apiStatus.ok ? '#16a34a' : '#dc2626' }}>{apiStatus.message}</p>
          )}
          <p style={{ fontSize: 12, color: '#6b7280' }}>Endpoint testado: /api/projects/</p>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;