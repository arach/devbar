import React, { useState, useEffect, ReactNode } from 'react';
import { Bug, X, LucideIcon } from 'lucide-react';

export interface DevToolbarTab {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode | (() => ReactNode);
}

export interface DevToolbarProps {
  tabs: DevToolbarTab[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  defaultTab?: string;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  hideInProduction?: boolean;
  customIcon?: ReactNode;
  title?: string;
  width?: string;
  maxHeight?: string;
}

export const DevToolbar: React.FC<DevToolbarProps> = ({
  tabs,
  position = 'bottom-right',
  defaultTab,
  className = '',
  theme = 'auto',
  hideInProduction = true,
  customIcon,
  title = 'Dev',
  width = '280px',
  maxHeight = '240px',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);
  
  // Only check environment on client side to avoid hydration mismatch
  useEffect(() => {
    // Always show in development, hide in production if specified
    const shouldShow = !hideInProduction || (typeof window !== 'undefined' && process.env.NODE_ENV === 'development');
    setIsVisible(shouldShow);
  }, [hideInProduction]);
  
  // SSR-safe rendering: return null during SSR, actual content after hydration
  if (!isVisible) {
    return null;
  }
  
  // Position styles for button and panel (offset panel to avoid overlap)
  const buttonStyles = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: '12px', 
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',  // white : gray-900
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '12px', 
      left: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '12px', 
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '12px', 
      left: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
    },
  };
  
  // Panel positioned with offset to avoid covering the button
  const panelStyles = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: '56px', 
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827', // Solid backgrounds
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '56px', 
      left: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '56px', 
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '56px', 
      left: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
    },
  };
  
  // Theme classes (fully opaque backgrounds)
  const themeClasses = theme === 'light' 
    ? 'bg-white border-gray-300 text-gray-900'
    : 'bg-gray-900 dark:bg-black border-gray-700 dark:border-gray-800 text-white';
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab);
  
  return (
    <>
      {/* Bug button - always visible */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-8 h-8 rounded-full
                   ${theme === 'light' ? 'bg-white' : 'bg-gray-900 dark:bg-black'}
                   border ${theme === 'light' ? 'border-gray-300' : 'border-gray-700 dark:border-gray-800'}
                   shadow-lg shadow-black/50
                   flex items-center justify-center
                   ${theme === 'light' ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-gray-800'}
                   transition-all duration-300
                   hover:scale-110 active:scale-95
                   z-[9999] ${className}`}
        style={buttonStyles[position]}
        title={isCollapsed ? `Show ${title.toLowerCase()} toolbar` : `Hide ${title.toLowerCase()} toolbar`}
      >
        {customIcon || (
          <Bug 
            className="w-4 h-4"
            style={{
              transition: 'transform 0.3s ease',
              transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              color: theme === 'light' ? '#111827' : '#ffffff'  // gray-900 : white
            }}
            suppressHydrationWarning
            aria-hidden="true"
          />
        )}
      </button>
      
      {/* Dev toolbar panel */}
      {!isCollapsed && (
        <div className={`rounded
                        ${themeClasses}
                        border
                        shadow-2xl shadow-black/50
                        z-[9998]
                        overflow-hidden
                        flex flex-col ${className}`}
             style={{ 
               ...panelStyles[position], 
               width, 
               maxHeight,
             }}>
          {/* Header */}
          <div className={`flex items-center justify-between px-2 py-1 border-b ${
            theme === 'light' ? 'border-gray-300' : 'border-gray-700/50'
          }`}>
            <div className="flex items-center gap-1">
              {customIcon || (
                <Bug 
                  className={`w-3 h-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
                  suppressHydrationWarning
                  aria-hidden="true"
                />
              )}
              <h3 className={`font-medium text-[10px] ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{title}</h3>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className={`${
                theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
              } transition-colors`}
            >
              <X 
                className="w-3 h-3"
                suppressHydrationWarning
                aria-hidden="true"
              />
            </button>
          </div>
          
          {/* Tabs */}
          {tabs.length > 1 && (
            <div className={`flex border-b ${theme === 'light' ? 'border-gray-300' : 'border-gray-700/50'}`}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors
                    ${activeTab === id
                      ? theme === 'light'
                        ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
                        : 'bg-gray-800 text-white border-b-2 border-red-500'
                      : theme === 'light'
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <Icon 
                    className="w-3 h-3"
                    suppressHydrationWarning
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-2">
            {activeTabContent && (
              typeof activeTabContent.content === 'function' 
                ? activeTabContent.content() 
                : activeTabContent.content
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Export a simple hook for creating toolbar tabs
export const useDevToolbarTab = (
  id: string,
  label: string,
  icon: LucideIcon,
  content: ReactNode | (() => ReactNode)
): DevToolbarTab => {
  return { id, label, icon, content };
};

// Export utility components for consistent styling
export const DevToolbarSection: React.FC<{ 
  title?: string; 
  children: ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {title && (
      <div className="text-[10px] font-mono font-semibold text-gray-400 uppercase">
        {title}
      </div>
    )}
    {children}
  </div>
);

export const DevToolbarButton: React.FC<{
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'xs';
  children: ReactNode;
  className?: string;
}> = ({ onClick, variant = 'default', size = 'xs', children, className = '' }) => {
  const variants = {
    default: 'bg-gray-800 hover:bg-gray-700',
    success: 'bg-green-800 hover:bg-green-700',
    warning: 'bg-yellow-800 hover:bg-yellow-700',
    danger: 'bg-red-800 hover:bg-red-700',
  };
  
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-[11px]',
  };
  
  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} text-white rounded
                 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export const DevToolbarInfo: React.FC<{
  label: string;
  value: string | number | boolean;
  className?: string;
}> = ({ label, value, className = '' }) => (
  <div className={`text-[10px] font-mono text-gray-300 ${className}`}>
    <span className="text-gray-500">{label}:</span> {String(value)}
  </div>
);