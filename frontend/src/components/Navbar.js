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
    <header className="navbar">
      <div className="navbar__inner">
        {/* Left reserved area (logo) */}
        <div className="w-260" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onLogoClick}
            title="Ir para Início"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={logo} alt="Safira" className="logo" />
          </button>
        </div>

        {/* Center area with tabs (geometrically centered) */}
        <div className="navbar__tabs">
          {tabs
            .filter((tab) => !hiddenKeys.includes(tab.key))
            .map((tab) => (
              <button
                key={tab.key}
                onClick={() => onChange && onChange(tab.key)}
                className={`tab-btn ${activeTab === tab.key ? 'tab-btn--active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
        </div>

        {/* Right reserved area (auth actions) with same width as left */}
        <nav className="w-260" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          {!isAuthenticated ? (
            <>
              <button onClick={onLogin} className="btn">Login</button>
              <button onClick={onSignup} className="btn btn-primary">Cadastro</button>
            </>
          ) : (
            <button onClick={onSignOut} className="btn">Sair</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
