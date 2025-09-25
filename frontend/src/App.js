import React, { useEffect, useState } from 'react';
import Tabs from './components/Tabs';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import UsersList from './pages/UsersList';
import ApiStatus from './pages/ApiStatus';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [token, setToken] = useState('');

  useEffect(() => {
    try {
      const t = localStorage.getItem('authToken') || '';
      setToken(t || '');
    } catch (_) {}
  }, []);

  const handleAuth = (tok) => {
    setToken(tok || '');
    if (tok) {
      setActiveTab('overview');
    }
  };

  const handleSignOut = () => {
    try { localStorage.removeItem('authToken'); } catch (_) {}
    setToken('');
    setActiveTab('overview');
  };

  const tabs = [
    {
      key: 'overview',
      label: 'Início',
      content: <Overview />,
    },
    {
      key: 'login',
      label: 'Login',
      content: <Login onAuth={handleAuth} onNavigateSignup={() => setActiveTab('signup')} />,
    },
    {
      key: 'signup',
      label: 'Cadastro',
      content: <Signup onAuth={handleAuth} />,
    },
    {
      key: 'projects',
      label: 'Projetos',
      content: <Projects />,
    },
    {
      key: 'tasks',
      label: 'Tarefas',
      content: <Tasks />,
    },
    {
      key: 'users',
      label: 'Usuários',
      content: <UsersList />,
    },
    {
      key: 'api',
      label: 'Status API',
      content: <ApiStatus />,
    },
  ];

  return (
    <div>
      <Navbar
        isAuthenticated={!!token}
        onLogin={() => setActiveTab('login')}
        onSignup={() => setActiveTab('signup')}
        onSignOut={handleSignOut}
        onLogoClick={() => setActiveTab('overview')}
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        hiddenKeys={['login', 'signup', 'api']}
      />
      <main className="container">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          hiddenKeys={['login', 'signup', 'api']}
          showHeader={false}
        />
      </main>
    </div>
  );
}

export default App;