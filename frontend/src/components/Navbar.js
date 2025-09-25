import React from 'react';
import logo from '../assets/logo_safira.png';

function Navbar({ isAuthenticated, onLogin, onSignup, onSignOut, onLogoClick }) {
  return (
    <header style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
      <div style={{ maxWidth:2000, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={onLogoClick}
          title="Ir para Início"
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <img src={logo} alt="Safira" style={{ height: 88, width: 88, objectFit: 'contain', borderRadius: 8, display: 'block' }} />
        </button>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isAuthenticated ? (
            <>
              <button onClick={onLogin} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Login</button>
              <button onClick={onSignup} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #2563eb', background: '#2563eb', color: 'white', cursor: 'pointer' }}>Cadastro</button>
            </>
          ) : (
            <button onClick={onSignOut} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Sair</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
