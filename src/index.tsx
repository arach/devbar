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
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'pane';
  defaultTab?: string;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  hideInProduction?: boolean;
  customIcon?: ReactNode;
  title?: string;
  width?: string;
  maxHeight?: string;
  defaultPaneHeight?: string;  // For pane mode
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
  width = '320px',  // Slightly wider for better content fit
  maxHeight = '400px',  // Taller to accommodate most content without scrolling
  defaultPaneHeight = '300px',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);
  const [paneHeight, setPaneHeight] = useState(defaultPaneHeight);
  const [isResizing, setIsResizing] = useState(false);
  
  // Only check environment on client side to avoid hydration mismatch
  useEffect(() => {
    // Always show in development, hide in production if specified
    const shouldShow = !hideInProduction || (typeof window !== 'undefined' && process.env.NODE_ENV === 'development');
    setIsVisible(shouldShow);
  }, [hideInProduction]);
  
  // Handle resize for pane mode
  useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = window.innerHeight - e.clientY;
      const minHeight = 100;
      const maxHeight = window.innerHeight * 0.8;
      
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setPaneHeight(`${newHeight}px`);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  // Add ESC key handler
  useEffect(() => {
    if (position !== 'pane' || isCollapsed) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCollapsed(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [position, isCollapsed]);
  
  // SSR-safe rendering: return null during SSR, actual content after hydration
  if (!isVisible) {
    return null;
  }
  
  // Button positioned to overlap corner of panel when open
  const buttonStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: isCollapsed ? '12px' : '8px',  // Overlap panel corner when open
      right: isCollapsed ? '12px' : '8px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',  // white : gray-900
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
      zIndex: 9999,
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: isCollapsed ? '12px' : '8px',
      left: isCollapsed ? '12px' : '8px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
      zIndex: 9999,
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: isCollapsed ? '12px' : '8px',
      right: isCollapsed ? '12px' : '8px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
      zIndex: 9999,
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: isCollapsed ? '12px' : '8px',
      left: isCollapsed ? '12px' : '8px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
      zIndex: 9999,
    },
    'pane': { 
      position: 'fixed' as const, 
      bottom: '12px',
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      color: theme === 'light' ? '#111827' : '#ffffff',
      cursor: 'pointer',
      zIndex: 9999,
    },
  };
  
  // Panel positioned at corner with button overlapping
  const panelStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: '12px', 
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827', // Solid backgrounds
      borderRadius: '12px',
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '12px', 
      left: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '12px',
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '12px', 
      right: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '12px',
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '12px', 
      left: '12px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '12px',
    },
    'pane': { 
      position: 'fixed' as const, 
      bottom: isCollapsed ? '-100%' : '0',
      left: '0',
      right: '0',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '0',
      borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
      transition: 'bottom 0.3s ease-in-out',
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
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
        <div className={`${themeClasses}
                        ${position !== 'pane' ? 'border shadow-2xl shadow-black/50' : ''}
                        ${className}`}
             style={{ 
               ...panelStyles[position], 
               width: position === 'pane' ? '100%' : width, 
               height: position === 'pane' ? paneHeight : maxHeight,
               display: 'flex',
               flexDirection: 'column',
               overflow: 'hidden',
               zIndex: 9998,
             }}>
          {/* Resize handle for pane mode */}
          {position === 'pane' && (
            <div 
              onMouseDown={() => setIsResizing(true)}
              style={{
                height: '5px',
                cursor: 'ns-resize',
                backgroundColor: 'transparent',
                borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'light' 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (!isResizing) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            />
          )}
          {/* Header - Fixed height */}
          <div className={`flex items-center justify-between border-b flex-shrink-0 ${
            theme === 'light' ? 'border-gray-300' : 'border-gray-700/50'
          }`} style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', height: '36px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
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
          
          {/* Tabs - Fixed height when present */}
          {tabs.length > 1 && (
            <div className={`flex border-b flex-shrink-0 ${theme === 'light' ? 'border-gray-300' : 'border-gray-700/50'}`} style={{ height: '40px' }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: activeTab === id 
                      ? (theme === 'light' ? '#f3f4f6' : '#1f2937')
                      : 'transparent',
                    color: activeTab === id
                      ? (theme === 'light' ? '#111827' : '#ffffff')
                      : (theme === 'light' ? '#6b7280' : '#9ca3af'),
                    borderBottom: activeTab === id ? `2px solid ${theme === 'light' ? '#3b82f6' : '#ef4444'}` : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
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
          
          {/* Content - Fixed height with scrolling */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
            <div style={{ padding: '16px' }}>
              {activeTabContent && (
                typeof activeTabContent.content === 'function' 
                  ? activeTabContent.content() 
                  : activeTabContent.content
              )}
            </div>
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
  <div style={{ marginBottom: '16px' }} className={className}>
    {title && (
      <div style={{ 
        fontSize: '10px',
        fontFamily: 'monospace', 
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: '8px',
        color: '#9ca3af'
      }}>
        {title}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {children}
    </div>
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