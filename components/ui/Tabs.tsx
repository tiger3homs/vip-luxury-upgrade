import React, { useState, createContext, useContext } from 'react';

// Tab Context
interface TabContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// Tabs Container
interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ 
  defaultTab, 
  children, 
  className = '',
  onChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabContext.Provider>
  );
};

// Tab List (horizontal navigation)
interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`flex border-b border-white/10 overflow-x-auto ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
};

// Individual Tab Button
interface TabProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ id, children, className = '', icon }) => {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest
        border-b-2 transition-all whitespace-nowrap
        ${isActive 
          ? 'text-brand-yellow border-brand-yellow' 
          : 'text-brand-muted border-transparent hover:text-white hover:border-white/20'
        }
        ${className}
      `}
    >
      {icon}
      {children}
    </button>
  );
};

// Tab Panel (content area)
interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ id, children, className = '' }) => {
  const { activeTab } = useTabContext();
  
  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={id}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
};

// Vertical Tabs variant
interface VerticalTabListProps {
  children: React.ReactNode;
  className?: string;
}

export const VerticalTabList: React.FC<VerticalTabListProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`flex flex-col border-r border-white/10 ${className}`}
      role="tablist"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
};

export const VerticalTab: React.FC<TabProps> = ({ id, children, className = '', icon }) => {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-widest text-left
        border-l-2 transition-all
        ${isActive 
          ? 'text-brand-yellow border-brand-yellow bg-brand-yellow/5' 
          : 'text-brand-muted border-transparent hover:text-white hover:bg-white/5'
        }
        ${className}
      `}
    >
      {icon}
      {children}
    </button>
  );
};
