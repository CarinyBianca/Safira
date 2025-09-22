import React from 'react';

function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e5e7eb', marginBottom: 16 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === tab.key ? '#2563eb' : '#374151',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 600 : 500,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
}

export default Tabs;
