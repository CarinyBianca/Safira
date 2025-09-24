import React, { useEffect, useState } from 'react';
import api from '../api/client';

function ProjectsManager() {
  const emptyForm = { id: null, name: '', description: '' };
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: '' });

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // Limpa erro de campo ao editar
    if (name in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => setForm(emptyForm);

  const validateForm = () => {
    const errs = { name: '' };
    const name = (form.name || '').trim();
    if (!name) {
      errs.name = 'Informe o nome do projeto.';
    } else if (name.length < 3) {
      errs.name = 'O nome do projeto deve ter pelo menos 3 caracteres.';
    } else if (name.length > 255) {
      errs.name = 'O nome do projeto deve ter no máximo 255 caracteres.';
    }
    setFieldErrors(errs);
    return !errs.name;
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) {
      return;
    }
    setSaving(true);
    const payload = { name: form.name.trim(), description: (form.description || '').trim() };
    try {
      if (form.id) {
        const res = await api.put(`projects/${form.id}/`, payload);
        setProjects((prev) => prev.map((p) => (p.id === form.id ? res.data : p)));
        setSuccess('Projeto atualizado com sucesso.');
      } else {
        const res = await api.post('projects/', payload);
        setProjects((prev) => [res.data, ...prev]);
        setSuccess('Projeto criado com sucesso.');
      }
      resetForm();
    } catch (e) {
      const apiErr = e?.response?.data;
      const msg = apiErr?.name?.[0] || apiErr?.detail || 'Erro ao salvar projeto.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => setForm({ id: project.id, name: project.name, description: project.description || '' });

  const deleteProject = async (id) => {
    if (!window.confirm('Excluir este projeto? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete(`projects/${id}/`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (form.id === id) resetForm();
      setSuccess('Projeto excluído com sucesso.');
    } catch (e) {
      setError('Erro ao excluir projeto.');
    }
  };

  const addUserToProject = async (projectId, userId) => {
    try {
      await api.post(`projects/${projectId}/add_user/`, { user_id: Number(userId) });
      await loadProjects();
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.status || 'Não foi possível adicionar o usuário.');
    }
  };

  const removeUserFromProject = async (projectId, userId) => {
    try {
      await api.post(`projects/${projectId}/remove_user/`, { user_id: Number(userId) });
      await loadProjects();
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.status || 'Não foi possível remover o usuário.');
    }
  };

  return (
    <div>
      {error && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <form onSubmit={saveProject} style={{ flex: '1 1 340px', minWidth: 320, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>{form.id ? 'Editar Projeto' : 'Novo Projeto'}</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Nome</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nome do projeto" required minLength={3} maxLength={255} style={{ width: '100%', padding: 8, borderColor: fieldErrors.name ? '#ef4444' : '#e5e7eb', borderWidth: 1, borderStyle: 'solid', borderRadius: 6 }} />
              {fieldErrors.name && (
                <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{fieldErrors.name}</div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Descrição</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição (opcional)" rows={3} maxLength={2000} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={saving} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
                {saving ? 'Salvando...' : (form.id ? 'Salvar Alterações' : 'Criar Projeto')}
              </button>
              {form.id && (
                <button type="button" onClick={resetForm} disabled={saving} style={{ padding: '8px 12px', background: '#6b7280', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>

        <div style={{ flex: '2 1 520px', minWidth: 360 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Projetos</h3>
            <button onClick={loadProjects} disabled={loading} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: 8 }}>Nome</th>
                  <th style={{ padding: 8 }}>Descrição</th>
                  <th style={{ padding: 8 }}>Membros</th>
                  <th style={{ padding: 8, width: 220 }}>Gerenciar</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 16, color: '#6b7280' }}>Nenhum projeto encontrado.</td>
                  </tr>
                )}
                {projects.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 8 }}>{p.name}</td>
                    <td style={{ padding: 8 }}>{p.description}</td>
                    <td style={{ padding: 8 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(p.users || []).map((u) => (
                          <span key={u.id} title={u.email} style={{ background: '#eef2ff', color: '#4338ca', padding: '2px 6px', borderRadius: 999, fontSize: 12 }}>
                            {u.username}
                            <button onClick={() => removeUserFromProject(p.id, u.id)} title="Remover" style={{ marginLeft: 6, border: 'none', background: 'transparent', color: '#991b1b', cursor: 'pointer' }}>×</button>
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                        <input type="number" min="1" placeholder="ID do usuário" id={`add-user-${p.id}`} style={{ width: 120, padding: 6, border: '1px solid #e5e7eb', borderRadius: 6 }} />
                        <button onClick={() => {
                          const el = document.getElementById(`add-user-${p.id}`);
                          const userId = el?.value;
                          if (!userId) return;
                          addUserToProject(p.id, userId);
                          el.value = '';
                        }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Adicionar</button>
                      </div>
                    </td>
                    <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                      <button onClick={() => editProject(p)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => deleteProject(p.id)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsManager;
