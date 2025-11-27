import React from 'react';

interface TabsProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex(t => t.value === activeTab)
    if (e.key === 'ArrowRight') {
      const next = tabs[(idx + 1) % tabs.length]
      onChange(next.value)
    } else if (e.key === 'ArrowLeft') {
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length]
      onChange(prev.value)
    }
  }

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div role="tablist" aria-label="Tabs" className="flex space-x-8" onKeyDown={handleKeyDown}>
        {tabs.map((tab, i) => {
          const selected = activeTab === tab.value
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.value}`}
              id={`tab-${tab.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.value)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selected
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  );
};
