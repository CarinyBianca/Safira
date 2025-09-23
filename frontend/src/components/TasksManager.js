import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'done', label: 'Concluída' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

function TasksManager() {
  const emptyForm = {
    id: null,
    project: '',
    title: '',
    description: '',
    assigned_to: '',
    status: 'todo',
    priority: 'medium',
  };

  const [form, setForm] = useState(emptyForm);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedProjectUsers = useMemo(() => {
    const project = projects.find((p) => String(p.id) === String(form.project));
    return project?.users || [];
  }, [projects, form.project]);

  const loadInitial = async () => {
    setLoading(true);
    setError('');
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get('projects/'),
        api.get('tasks/'),
      ]);
      setProjects(projRes.data || []);
      setTasks(taskRes.data || []);
    } catch (e) {
      setError(
        e?.response?.data?.detail ||
          'Falha ao carregar dados. Verifique se você está autenticado e se a API está rodando.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectProject = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, project: value, assigned_to: '' }));
  };

  const resetForm = () => setForm(emptyForm);

  const saveTask = async (e) => {
    e.preventDefault();
    if (!form.project) return setError('Selecione um projeto.');
    if (!form.title.trim()) return setError('Informe um título.');

    setSaving(true);
    setError('');
    const payload = {
      project: Number(form.project),
      title: form.title,
      description: form.description || '',
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      status: form.status,
      priority: form.priority,
    };

    try {
      if (form.id) {
        // update
        const res = await api.put(`tasks/${form.id}/`, payload);
        setTasks((prev) => prev.map((t) => (t.id === form.id ? res.data : t)));
      } else {
        // create
        const res = await api.post('tasks/', payload);
        setTasks((prev) => [res.data, ...prev]);
      }
      resetForm();
    } catch (e) {
      const msg =
        e?.response?.data?.assigned_to?.[0] ||
        e?.response?.data?.detail ||
        e?.message ||
        'Erro ao salvar a tarefa.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const editTask = (task) => {
    setForm({
      id: task.id,
      project: String(task.project),
      title: task.title || '',
      description: task.description || '',
      assigned_to: task.assigned_to ? String(task.assigned_to) : '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
    });
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`tasks/${taskId}/`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (form.id === taskId) resetForm();
    } catch (e) {
      setError('Erro ao excluir tarefa.');
    }
  };

  const quickUpdate = async (task, patch) => {
    try {
      const res = await api.patch(`tasks/${task.id}/`, patch);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
    } catch (e) {
      setError('Não foi possível atualizar a tarefa.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <form onSubmit={saveTask} style={{ flex: '1 1 360px', minWidth: 320, border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>{form.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>

          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 8, borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Projeto</label>
              <select name="project" value={form.project} onChange={handleSelectProject} required style={{ width: '100%', padding: 8 }}>
                <option value="">Selecione...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Título</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Título da tarefa" required style={{ width: '100%', padding: 8 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Descrição</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição (opcional)" rows={3} style={{ width: '100%', padding: 8 }} />
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Responsável</label>
                <select name="assigned_to" value={form.assigned_to} onChange={handleChange} disabled={!form.project} style={{ width: '100%', padding: 8 }}>
                  <option value="">Nenhum</option>
                  {selectedProjectUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%', padding: 8 }}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Prioridade</label>
                <select name="priority" value={form.priority} onChange={handleChange} style={{ width: '100%', padding: 8 }}>
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={saving} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
                {saving ? 'Salvando...' : (form.id ? 'Salvar Alterações' : 'Criar Tarefa')}
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
            <h3 style={{ margin: 0 }}>Tarefas</h3>
            <button onClick={loadInitial} disabled={loading} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: 8 }}>Título</th>
                  <th style={{ padding: 8 }}>Projeto</th>
                  <th style={{ padding: 8 }}>Responsável</th>
                  <th style={{ padding: 8 }}>Status</th>
                  <th style={{ padding: 8 }}>Prioridade</th>
                  <th style={{ padding: 8, width: 160 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: '#6b7280' }}>Nenhuma tarefa encontrada.</td>
                  </tr>
                )}
                {tasks.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 8 }}>{t.title}</td>
                    <td style={{ padding: 8 }}>{t.project_name || t.project}</td>
                    <td style={{ padding: 8 }}>{t.assigned_to_username || '-'}</td>
                    <td style={{ padding: 8 }}>
                      <select value={t.status} onChange={(e) => quickUpdate(t, { status: e.target.value })} style={{ padding: 4 }}>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: 8 }}>
                      <select value={t.priority} onChange={(e) => quickUpdate(t, { priority: e.target.value })} style={{ padding: 4 }}>
                        {PRIORITY_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                      <button onClick={() => editTask(t)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => deleteTask(t.id)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>Excluir</button>
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

export default TasksManager;
