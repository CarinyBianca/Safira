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
        <div className="alert">{message}</div>
      )}

      <div className="mt-3">
        <strong>Status:</strong> {token ? 'Autenticado' : 'Não autenticado'}
        {token && (
          <div className="text-muted" style={{ fontSize: 12, wordBreak: 'break-all' }}>Token: {token}</div>
        )}
      </div>

      <form onSubmit={signIn} className="form-card mt-3">
        <div className="form-grid">
          <div>
            <label className="label">Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuário"
              required
              minLength={3}
              className={`input ${fieldError ? 'input--error' : ''}`}
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              minLength={3}
              className={`input ${fieldError ? 'input--error' : ''}`}
            />
          </div>
          {fieldError && (
            <div className="text-danger" style={{ fontSize: 12 }}>{fieldError}</div>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            {token && (
              <button type="button" onClick={signOut} className="btn">
                Sair
              </button>
            )}
          </div>
        </div>
      </form>

      <p className="text-muted mt-3" style={{ fontSize: 12 }}>
        Dica: se precisar criar um admin: <code>manage.py createsuperuser</code> e depois autentique com esse usuário.
      </p>

      {!token && (
        <p className="mt-3" style={{ fontSize: 14 }}>
          Não tem conta?{' '}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); if (onNavigateSignup) onNavigateSignup(); }}
            style={{ color: 'var(--violet-600)' }}
          >
            Cadastre-se
          </a>
        </p>
      )}
    </div>
  );
}

export default Login;
