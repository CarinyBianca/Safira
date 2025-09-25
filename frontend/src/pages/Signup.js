import React, { useState } from 'react';
import api from '../api/client';

function Signup({ onAuth }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldError, setFieldError] = useState({ username: '', password: '', confirm: '' });

  const validate = () => {
    const errs = { username: '', password: '', confirm: '' };
    const u = (username || '').trim();
    const p = password || '';
    const c = confirm || '';
    if (!u || u.length < 3) {
      errs.username = 'Usuário deve ter pelo menos 3 caracteres.';
    }
    if (!p || p.length < 3) {
      errs.password = 'Senha deve ter pelo menos 3 caracteres.';
    }
    if (c !== p) {
      errs.confirm = 'As senhas não coincidem.';
    }
    setFieldError(errs);
    return !errs.username && !errs.password && !errs.confirm;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('register/', { username: username.trim(), email: email.trim(), password });
      const tok = res.data?.token;
      if (tok) {
        localStorage.setItem('authToken', tok);
        if (onAuth) onAuth(tok);
        setMessage('Conta criada com sucesso. Você está autenticado.');
        setUsername(''); setEmail(''); setPassword(''); setConfirm('');
      } else {
        setMessage('Resposta inválida do servidor.');
      }
    } catch (e) {
      const msg = e?.response?.data?.detail || 'Falha ao criar conta.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      {message && (
        <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          {message}
        </div>
      )}
      <form onSubmit={submit} style={{ maxWidth: 420, border: '1px solid #e5e7eb', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Usuário</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" required minLength={3} style={{ width: '100%', padding: 8, borderColor: fieldError.username ? '#ef4444' : '#e5e7eb', borderWidth: 1, borderStyle: 'solid', borderRadius: 6 }} />
            {fieldError.username && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{fieldError.username}</div>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Email (opcional)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" style={{ width: '100%', padding: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required minLength={3} style={{ width: '100%', padding: 8, borderColor: fieldError.password ? '#ef4444' : '#e5e7eb', borderWidth: 1, borderStyle: 'solid', borderRadius: 6 }} />
            {fieldError.password && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{fieldError.password}</div>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Confirmar senha</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmar senha" required minLength={3} style={{ width: '100%', padding: 8, borderColor: fieldError.confirm ? '#ef4444' : '#e5e7eb', borderWidth: 1, borderStyle: 'solid', borderRadius: 6 }} />
            {fieldError.confirm && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4 }}>{fieldError.confirm}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
