import React, { useEffect, useState } from 'react';
import api from '../api/client';

function Overview() {
  const [state, setState] = useState({ loading: false, error: '', projects: 0, tasks: 0 });

  useEffect(() => {
    const load = async () => {
      setState((s) => ({ ...s, loading: true, error: '' }));
      try {
        const [p, t] = await Promise.all([
          api.get('projects/'),
          api.get('tasks/'),
        ]);
        setState({ loading: false, error: '', projects: (p.data || []).length, tasks: (t.data || []).length });
      } catch (e) {
        const msg = e?.response?.status === 401
          ? 'Faça login para visualizar seus projetos e tarefas.'
          : (e?.response?.data?.detail || 'Não foi possível carregar o resumo.');
        setState((s) => ({ ...s, loading: false, error: msg }));
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao Gerenciador de Tarefas Safira!</h1>
      <p style={{ color: '#6b7280' }}>Use as abas para navegar entre seções.</p>

      {state.error && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          {state.error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
        <div style={{ flex: '1 1 200px', minWidth: 200, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Projetos</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.loading ? '…' : state.projects}</div>
          <div style={{ marginTop: 8 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); /* no routes; tabs app */ }} style={{ color: '#2563eb' }}>Acesse a aba "Projetos"</a>
          </div>
        </div>

        <div style={{ flex: '1 1 200px', minWidth: 200, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Tarefas</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.loading ? '…' : state.tasks}</div>
          <div style={{ marginTop: 8 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ color: '#2563eb' }}>Acesse a aba "Tarefas"</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
