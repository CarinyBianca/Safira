import React, { useEffect, useState } from 'react';
import api from '../api/client';

function Login({ onAuth, onNavigateSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    try {
      const t = localStorage.getItem('authToken') || '';
      setToken(t || '');
    } catch (_) {}
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setFieldError('');
    try {
      const u = username.trim();
      const p = password;
      if (u.length < 3 || p.length < 3) {
        setFieldError('Usuário e senha devem ter pelo menos 3 caracteres.');
        return;
      }
      const res = await api.post('auth/', { username: u, password: p });
      const tok = res.data?.token;
      if (tok) {
        localStorage.setItem('authToken', tok);
        setToken(tok);
        setMessage('Autenticado com sucesso. Token salvo no navegador.');
        setUsername('');
        setPassword('');
        if (onAuth) onAuth(tok);
      } else {
        setMessage('Resposta inválida do servidor.');
      }
    } catch (e) {
      const msg = e?.response?.status === 400
        ? 'Usuário ou senha inválidos.'
        : (e?.response?.data?.detail || 'Falha ao autenticar.');
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    try { localStorage.removeItem('authToken'); } catch (_) {}
    setToken('');
    setMessage('Sessão encerrada.');
  };

  return (
    <div>
      <h2>Login</h2>
      {message && (
        <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: 8, borderRadius: 6, marginBottom: 12 }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <strong>Status:</strong> {token ? 'Autenticado' : 'Não autenticado'}
        {token && (
          <div style={{ fontSize: 12, color: '#6b7280', wordBreak: 'break-all' }}>Token: {token}</div>
        )}
      </div>

      <form onSubmit={signIn} style={{ maxWidth: 360, border: '1px solid #e5e7eb', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Usuário</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" required minLength={3} style={{ width: '100%', padding: 8, borderColor: fieldError ? '#ef4444' : '#e5e7eb', borderWidth: 1, borderStyle: 'solid', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280' }}>Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required minLength={3} style={{ width: '100%', padding: 8, borderColor: fieldError ? '#ef4444' : '#e5e7eb', borderWidth: 1, borderStyle: 'solid', borderRadius: 6 }} />
          </div>
          {fieldError && (
            <div style={{ color: '#b91c1c', fontSize: 12 }}>{fieldError}</div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            {token && (
              <button type="button" onClick={signOut} style={{ padding: '8px 12px', background: '#6b7280', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
                Sair
              </button>
            )}
          </div>
        </div>
      </form>

      <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>
        Dica: se precisar criar um admin: <code>manage.py createsuperuser</code> e depois autentique com esse usuário.
      </p>

      {!token && (
        <p style={{ fontSize: 14, marginTop: 12 }}>
          Não tem conta?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); if (onNavigateSignup) onNavigateSignup(); }} style={{ color: '#2563eb' }}>
            Cadastre-se
          </a>
        </p>
      )}
    </div>
  );
}

export default Login;
