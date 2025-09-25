import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiPlus, FiX, FiFolder, FiRefreshCcw } from 'react-icons/fi';
import api from '../api/client';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('projects/');
      setProjects(res.data || []);
    } catch (e) {
      const msg = e?.response?.status === 401
        ? 'Autenticação necessária. Salve seu token em localStorage como authToken.'
        : (e?.response?.data?.detail || 'Falha ao carregar projetos.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return projects;
    return projects.filter((p) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [projects, query]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const payload = { name: form.name.trim(), description: (form.description || '').trim() };
      const res = await api.post('projects/', payload);
      setProjects((prev) => [res.data, ...prev]);
      setForm({ name: '', description: '' });
      setShowCreate(false);
    } catch (e) {
      const msg = e?.response?.data?.name?.[0] || e?.response?.data?.detail || 'Erro ao criar projeto.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Projetos</h2>
          <div style={{ color: '#6b7280', fontSize: 14 }}>Organize e gerencie seus projetos</div>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: 'white', border: 0, borderRadius: 999, padding: '10px 16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
          <FiPlus />
          Novo Projeto
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e5e7eb', borderRadius: 999, padding: '8px 12px' }}>
          <FiSearch color="#9ca3af" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar projetos..."
            style={{ flex: 1, border: 'none', outline: 'none' }}
          />
        </div>
        <button onClick={loadProjects} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>
          <FiRefreshCcw style={{ transform: loading ? 'rotate(90deg)' : 'none', transition: 'transform .2s ease' }} />
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 10, marginBottom: 12 }}>{error}</div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, border: '1px dashed #e5e7eb', borderRadius: 16, background: '#fafafa' }}>
          <div style={{ fontSize: 48, marginBottom: 12, color: '#a78bfa' }}>
            <FiFolder size={48} />
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Nenhum projeto encontrado</div>
          <div style={{ color: '#6b7280', marginBottom: 16 }}>Crie seu primeiro projeto para começar a organizar suas atividades</div>
          <button onClick={() => setShowCreate(true)} style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#7c3aed', color: 'white', border: 0, borderRadius: 12, padding: '12px 16px', cursor: 'pointer' }}>
            <FiPlus />
            Novo Projeto
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.name}</div>
              <div style={{ color: '#6b7280', fontSize: 14, minHeight: 40 }}>{p.description || 'Sem descrição.'}</div>
              <div style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>{(p.users || []).length} membro(s)</div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 520, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Novo Projeto</h3>
              <button onClick={() => setShowCreate(false)} disabled={saving} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <FiX />
              </button>
            </div>
            <form onSubmit={onCreate}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Nome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Nome do projeto"
                    required
                    minLength={3}
                    maxLength={255}
                    style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Descrição</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    placeholder="Descrição (opcional)"
                    rows={3}
                    maxLength={2000}
                    style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCreate(false)} disabled={saving} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ padding: '10px 14px', borderRadius: 10, background: '#7c3aed', color: 'white', border: 0, cursor: 'pointer' }}>{saving ? 'Criando...' : 'Criar Projeto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsList;
