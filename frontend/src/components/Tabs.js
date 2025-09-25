import React from 'react';

function Tabs({ tabs, activeTab, onChange, hiddenKeys = [], showHeader = true }) {
  return (
    <div>
      {showHeader && (
        <div className="tabs-header">
          {tabs
            .filter((tab) => !hiddenKeys.includes(tab.key))
            .map((tab) => (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`tab-btn ${activeTab === tab.key ? 'tab-btn--active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      )}
      <div>
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
}

export default Tabs;
