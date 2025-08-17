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
  
  // Button positioned with consistent spacing
  const buttonStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '24px',
      left: '24px',
      zIndex: 9999,
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '24px',
      right: '24px',
      zIndex: 9999,
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '24px',
      left: '24px',
      zIndex: 9999,
    },
    'pane': { 
      position: 'fixed' as const, 
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
    },
  };
  
  // Panel positioned at corner with button overlapping
  const panelStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: '24px', 
      right: '24px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827', // Solid backgrounds
      borderRadius: '12px',
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '24px', 
      left: '24px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '12px',
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '24px', 
      right: '24px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '12px',
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '24px', 
      left: '24px',
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
      borderTop: `0.5px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
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
        style={{
          ...buttonStyles[position],
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          backgroundColor: theme === 'light' ? '#ffffff' : '#0a0a0a',
          backgroundImage: theme === 'dark' ? 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' : 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: theme === 'light' 
            ? '0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04)'
            : '0 0 0 1px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = theme === 'light'
            ? '0 0 0 1px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.08)'
            : '0 0 0 1px rgba(255, 255, 255, 0.15), 0 4px 8px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = theme === 'light'
            ? '0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04)'
            : '0 0 0 1px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title={isCollapsed ? `Show ${title.toLowerCase()} toolbar` : `Hide ${title.toLowerCase()} toolbar`}
        className={className}
      >
        {customIcon || (
          <Bug 
            style={{
              width: '20px',
              height: '20px',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              color: theme === 'light' ? '#374151' : '#d1d5db',
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
          {/* Header with title bar and close button */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : 'rgba(55, 65, 81, 0.5)'}`,
            paddingLeft: '12px',
            paddingRight: '8px',
            paddingTop: '6px',
            paddingBottom: '6px',
            height: '34px',
            flexShrink: 0,
          }}>
            <div className="flex items-center" style={{ gap: '6px' }}>
              {customIcon || (
                <Bug 
                  className={`w-3 h-3 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                  suppressHydrationWarning
                  aria-hidden="true"
                />
              )}
              <h3 className={`font-medium text-[11px] ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`} style={{ letterSpacing: '0.2px' }}>{title}</h3>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                color: theme === 'light' ? '#6b7280' : '#9ca3af',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = theme === 'light' ? '#111827' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme === 'light' ? '#6b7280' : '#9ca3af';
              }}
              title="Close toolbar"
            >
              <X 
                className="w-3.5 h-3.5"
                suppressHydrationWarning
                aria-hidden="true"
              />
            </button>
          </div>
          
          {/* Tabs - Fixed height when present */}
          {tabs.length > 1 && (
            <div style={{ 
              display: 'flex',
              borderBottom: `1px solid ${theme === 'light' ? '#e5e7eb' : 'rgba(55, 65, 81, 0.5)'}`,
              height: '36px',
              flexShrink: 0,
            }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: activeTab === id 
                      ? (theme === 'light' ? '#f9fafb' : '#1f2937')
                      : 'transparent',
                    color: activeTab === id
                      ? (theme === 'light' ? '#111827' : '#ffffff')
                      : (theme === 'light' ? '#6b7280' : '#9ca3af'),
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: activeTab === id ? `2px solid ${theme === 'light' ? '#3b82f6' : '#60a5fa'}` : `2px solid transparent`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon 
                    className="w-2.5 h-2.5"
                    suppressHydrationWarning
                    aria-hidden="true"
                  />
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Content - Fixed height with scrolling */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
            <div style={{ padding: '12px' }}>
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
  <div style={{ marginBottom: '12px' }} className={className}>
    {title && (
      <div style={{ 
        fontSize: '9px',
        fontFamily: 'monospace', 
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: '6px',
        color: '#9ca3af',
        letterSpacing: '0.5px'
      }}>
        {title}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
    default: 'bg-gray-700 hover:bg-gray-600',
    success: 'bg-green-700 hover:bg-green-600',
    warning: 'bg-yellow-700 hover:bg-yellow-600',
    danger: 'bg-red-700 hover:bg-red-600',
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
  <div className={`text-[9px] font-mono ${className}`} style={{ color: '#e5e7eb' }}>
    <span style={{ color: '#9ca3af' }}>{label}:</span> {String(value)}
  </div>
);