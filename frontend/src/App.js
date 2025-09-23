import React, { useState } from 'react';
import Tabs from './components/Tabs';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import UsersList from './pages/UsersList';
import ApiStatus from './pages/ApiStatus';
import Login from './pages/Login';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      key: 'overview',
      label: 'Início',
      content: <Overview />,
    },
    {
      key: 'login',
      label: 'Login',
      content: <Login />,
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
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;