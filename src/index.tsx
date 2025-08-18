import React, { useState, useEffect, ReactNode } from 'react';
import { Bug, X, Maximize2, Minimize2, LucideIcon } from 'lucide-react';

// Typography system with Inconsolata
const FONT_FAMILY = '"Inconsolata", "SF Mono", "Monaco", "Fira Code", "Geist Mono", monospace';

const typography = {
  title: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  tab: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.7rem',
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  info: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.7rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  button: {
    xs: {
      fontFamily: FONT_FAMILY,
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    sm: {
      fontFamily: FONT_FAMILY,
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
} as const;

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
  defaultOpen?: boolean;  // Control initial open state
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
  defaultOpen = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);
  const [paneHeight, setPaneHeight] = useState(defaultPaneHeight);
  const [isResizing, setIsResizing] = useState(false);
  
  // Only check environment on client side to avoid hydration mismatch
  useEffect(() => {
    // Always show in development, hide in production if specified
    // Check for development mode using a safer approach
    const isDevelopment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.startsWith('192.168.') ||
       window.location.hostname.includes('.local'));
    
    const shouldShow = !hideInProduction || isDevelopment;
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
      transform: isExpanded ? 'none' : 'none',
      transformOrigin: 'bottom right',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827', // Solid backgrounds
      borderRadius: '16px',
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '24px', 
      left: '24px',
      transform: isExpanded ? 'none' : 'none',
      transformOrigin: 'bottom left',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '16px',
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '24px', 
      right: '24px',
      transform: isExpanded ? 'none' : 'none',
      transformOrigin: 'top right',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '16px',
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '24px', 
      left: '24px',
      transform: isExpanded ? 'none' : 'none',
      transformOrigin: 'top left',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '16px',
    },
    'pane': { 
      position: 'fixed' as const, 
      bottom: isCollapsed ? '-100%' : '0',
      left: '0',
      right: '0',
      backgroundColor: theme === 'light' ? '#ffffff' : '#111827',
      borderRadius: '0',
      borderTop: `0.5px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
    },
  };
  
  // Theme classes (fully opaque backgrounds)
  const themeClasses = theme === 'light' 
    ? 'bg-white text-gray-900'
    : 'bg-gray-900 dark:bg-black text-white';
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab);
  
  return (
    <>
      {/* Bug button - always visible */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          ...buttonStyles[position],
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
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
              width: '16px',
              height: '16px',
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
                        ${position !== 'pane' ? 'shadow-2xl shadow-black/50' : ''}
                        ${className}`}
             style={{ 
               ...panelStyles[position], 
               width: position === 'pane' ? '100%' : (isExpanded ? '80%' : width), 
               maxWidth: position === 'pane' ? '100%' : (isExpanded ? '1200px' : '600px'),
               height: position === 'pane' ? paneHeight : (isExpanded ? '70vh' : maxHeight),
               maxHeight: position === 'pane' ? paneHeight : (isExpanded ? '800px' : maxHeight),
               transition: position === 'pane' 
                 ? 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                 : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               display: 'flex',
               flexDirection: 'column',
               overflow: 'hidden',
               zIndex: 9998,
               border: position !== 'pane' 
                 ? `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`
                 : 'none',
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
            paddingLeft: '10px',
            paddingRight: '6px',
            paddingTop: '4px',
            paddingBottom: '4px',
            height: '28px',
            flexShrink: 0,
          }}>
            <h3 style={{ 
              ...typography.title,
              color: theme === 'light' ? '#374151' : '#e5e7eb'
            }}>{title}</h3>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {position !== 'pane' && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    padding: '5px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    color: theme === 'light' ? '#9ca3af' : '#6b7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = theme === 'light' ? '#374151' : '#e5e7eb';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme === 'light' ? '#9ca3af' : '#6b7280';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
                  aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
                >
                  {isExpanded ? (
                    <Minimize2 style={{ width: '14px', height: '14px' }} />
                  ) : (
                    <Maximize2 style={{ width: '14px', height: '14px' }} />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsCollapsed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                padding: '5px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                color: theme === 'light' ? '#9ca3af' : '#6b7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = theme === 'light' ? '#374151' : '#e5e7eb';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme === 'light' ? '#9ca3af' : '#6b7280';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Close toolbar"
              aria-label="Close toolbar"
            >
              <X 
                style={{ width: '14px', height: '14px' }}
                suppressHydrationWarning
                aria-hidden="true"
              />
            </button>
            </div>
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
                  onMouseEnter={(e) => {
                    if (activeTab !== id) {
                      e.currentTarget.style.background = theme === 'light' 
                        ? 'rgba(243, 244, 246, 0.9)' 
                        : 'rgba(55, 65, 81, 0.8)';
                      e.currentTarget.style.backdropFilter = 'blur(12px)';
                      e.currentTarget.style.color = theme === 'light' ? '#111827' : '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = theme === 'light'
                        ? 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'
                        : 'inset 0 1px 3px rgba(255, 255, 255, 0.05)';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        (icon as SVGSVGElement).style.transform = 'scale(1.15) rotate(5deg)';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== id) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.backdropFilter = 'none';
                      e.currentTarget.style.color = theme === 'light' ? '#6b7280' : '#9ca3af';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) {
                        (icon as SVGSVGElement).style.transform = 'scale(1) rotate(0deg)';
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    ...typography.tab,
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
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    position: 'relative' as const,
                  }}
                >
                  <Icon 
                    style={{ 
                      width: '10px', 
                      height: '10px', 
                      strokeWidth: 1.5,
                      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
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
  theme?: 'light' | 'dark';
}> = ({ title, children, className = '', theme = 'dark' }) => (
  <div style={{ marginBottom: '12px' }} className={className}>
    {title && (
      <div style={{ 
        ...typography.sectionTitle,
        marginBottom: '6px',
        color: theme === 'light' ? '#6b7280' : '#9ca3af'
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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  size?: 'sm' | 'xs';
  children: ReactNode;
  className?: string;
}> = ({ onClick, variant = 'default', size = 'xs', children, className = '' }) => {
  const getVariantStyles = (variant: string) => {
    const styles: Record<string, React.CSSProperties> = {
      default: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '1px solid rgba(118, 75, 162, 0.3)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      primary: {
        background: 'linear-gradient(135deg, #667eea 0%, #4c6ef5 100%)',
        border: '1px solid rgba(76, 110, 245, 0.3)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      success: {
        background: 'linear-gradient(135deg, #56ab2f 0%, #10b981 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      warning: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        border: '1px solid rgba(245, 87, 108, 0.3)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      danger: {
        background: 'linear-gradient(135deg, #fa709a 0%, #f5576c 100%)',
        border: '1px solid rgba(245, 87, 108, 0.3)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    };
    return styles[variant] || styles.default;
  };

  const baseStyles = getVariantStyles(variant);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        ...typography.button[size],
        ...baseStyles,
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        padding: size === 'xs' ? '4px 10px' : '6px 14px',
        transition: 'all 0.1s ease',
        opacity: isPressed ? 0.9 : isHovered ? 0.95 : 1,
        filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
        boxShadow: isPressed 
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.15)' 
          : isHovered
          ? '0 4px 8px rgba(0, 0, 0, 0.15)'
          : baseStyles.boxShadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
};

export const DevToolbarInfo: React.FC<{
  label: string;
  value: string | number | boolean;
  className?: string;
  theme?: 'light' | 'dark';
}> = ({ label, value, className = '', theme = 'dark' }) => (
  <div style={{ 
    ...typography.info, 
    color: theme === 'light' ? '#374151' : '#e5e7eb' 
  }} className={className}>
    <span style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>{label}:</span> {String(value)}
  </div>
);

export const DevToolbarToggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  theme?: 'light' | 'dark';
}> = ({ checked, onChange, label, className = '', theme = 'dark' }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    gap: '8px',
    ...typography.info 
  }} className={className}>
    {label && (
      <span style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af', flex: 1 }}>{label}</span>
    )}
    <button
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        height: '20px',
        width: '36px',
        borderRadius: '9999px',
        backgroundColor: checked ? '#3b82f6' : '#4b5563',
        transition: 'background-color 0.2s',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          height: '14px',
          width: '14px',
          borderRadius: '50%',
          backgroundColor: 'white',
          transition: 'transform 0.2s',
          transform: checked ? 'translateX(18px)' : 'translateX(3px)',
        }}
      />
    </button>
  </div>
);