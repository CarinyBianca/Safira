import React from 'react';
import logo from '../assets/logo_safira.png';

function Navbar({
  isAuthenticated,
  onLogin,
  onSignup,
  onSignOut,
  onLogoClick,
  tabs = [],
  activeTab,
  onChange,
  hiddenKeys = [],
}) {
  return (
    <header style={{ borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
      <div style={{ maxWidth: 2000, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Left reserved area (logo) */}
        <div style={{ width: 260, display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onLogoClick}
            title="Ir para Início"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={logo} alt="Safira" style={{ height: 88, width: 88, objectFit: 'contain', borderRadius: 8, display: 'block' }} />
          </button>
        </div>

        {/* Center area with tabs (geometrically centered) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1, overflowX: 'auto' }}>
          {tabs
            .filter((tab) => !hiddenKeys.includes(tab.key))
            .map((tab) => (
              <button
                key={tab.key}
                onClick={() => onChange && onChange(tab.key)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
                  background: 'transparent',
                  color: activeTab === tab.key ? '#2563eb' : '#374151',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
        </div>

        {/* Right reserved area (auth actions) with same width as left */}
        <nav style={{ width: 260, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
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
