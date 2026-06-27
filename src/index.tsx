import React, { useState, useEffect, useMemo, useCallback, createContext, useContext, ReactNode, ComponentType } from 'react';
import { Bug, X, Maximize2, Minimize2 } from 'lucide-react';

export type DevToolbarTheme = 'light' | 'dark';
export type DevToolbarPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'pane';

export interface DevToolbarContextValue {
  theme: DevToolbarTheme;
  position: DevToolbarPosition;
  isExpanded: boolean;
  isOpen: boolean;
  isWide: boolean;
}

const DevToolbarContext = createContext<DevToolbarContextValue | null>(null);

export const useDevToolbarContext = (): DevToolbarContextValue => {
  const context = useContext(DevToolbarContext);
  if (!context) {
    throw new Error('useDevToolbarContext must be used within DevToolbar tab content');
  }
  return context;
};

export const useDevToolbarTheme = (override?: DevToolbarTheme): DevToolbarTheme => {
  const context = useContext(DevToolbarContext);
  return override ?? context?.theme ?? 'dark';
};

const JBM_FONT_LINK_ID = 'devbar-jetbrains-mono';
const FONT_FAMILY = '"JetBrains Mono", "SF Mono", "Monaco", "Fira Code", monospace';

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

const palette = {
  dark: {
    panel: 'rgba(18, 18, 20, 0.58)',
    panelGradient: 'linear-gradient(155deg, rgba(120, 120, 128, 0.18) 0%, rgba(39, 39, 42, 0.42) 38%, rgba(9, 9, 11, 0.72) 100%)',
    header: 'rgba(255, 255, 255, 0.04)',
    headerGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
    content: 'rgba(0, 0, 0, 0.22)',
    contentGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.28) 100%)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderStrong: 'rgba(255, 255, 255, 0.18)',
    glassBorder: 'rgba(255, 255, 255, 0.14)',
    text: '#f4f4f5',
    textMuted: '#c4c4cc',
    textDim: '#8b8b96',
    tabActive: 'rgba(255, 255, 255, 0.09)',
    tabActiveGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%)',
    tabHover: 'rgba(255, 255, 255, 0.05)',
    tabIndicator: '#e4e4e7',
    headerDot: '#d4d4d8',
    card: 'rgba(255, 255, 255, 0.04)',
    cardGradient: 'linear-gradient(160deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 55%, rgba(0, 0, 0, 0.12) 100%)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    sheen: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.28)',
    shadow: '0 28px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    button: 'rgba(255, 255, 255, 0.06)',
    buttonGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 48%, rgba(0, 0, 0, 0.12) 100%)',
    buttonBorder: 'rgba(255, 255, 255, 0.14)',
    buttonText: '#f4f4f5',
    fabGradient: 'linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(82, 82, 91, 0.35) 45%, rgba(9, 9, 11, 0.75) 100%)',
    fabShadow: '0 10px 28px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    toggleOff: 'rgba(0, 0, 0, 0.35)',
    toggleOn: 'rgba(255, 255, 255, 0.72)',
    danger: 'rgba(127, 29, 29, 0.42)',
    dangerGradient: 'linear-gradient(180deg, rgba(248, 113, 113, 0.22) 0%, rgba(127, 29, 29, 0.38) 100%)',
    dangerBorder: 'rgba(248, 113, 113, 0.35)',
    dangerText: '#fecaca',
  },
  light: {
    panel: 'rgba(255, 255, 255, 0.58)',
    panelGradient: 'linear-gradient(155deg, rgba(255, 255, 255, 0.92) 0%, rgba(244, 244, 245, 0.72) 42%, rgba(228, 228, 231, 0.55) 100%)',
    header: 'rgba(255, 255, 255, 0.35)',
    headerGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.35) 100%)',
    content: 'rgba(255, 255, 255, 0.28)',
    contentGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(244, 244, 245, 0.55) 100%)',
    border: 'rgba(0, 0, 0, 0.08)',
    borderStrong: 'rgba(0, 0, 0, 0.14)',
    glassBorder: 'rgba(255, 255, 255, 0.65)',
    text: '#18181b',
    textMuted: '#52525b',
    textDim: '#71717a',
    tabActive: 'rgba(0, 0, 0, 0.04)',
    tabActiveGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(244, 244, 245, 0.75) 100%)',
    tabHover: 'rgba(0, 0, 0, 0.03)',
    tabIndicator: '#3f3f46',
    headerDot: '#a1a1aa',
    card: 'rgba(255, 255, 255, 0.55)',
    cardGradient: 'linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(244, 244, 245, 0.7) 55%, rgba(228, 228, 231, 0.45) 100%)',
    cardBorder: 'rgba(255, 255, 255, 0.8)',
    sheen: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(0, 0, 0, 0.04)',
    shadow: '0 24px 60px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(255, 255, 255, 0.7)',
    button: 'rgba(255, 255, 255, 0.72)',
    buttonGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 244, 245, 0.82) 52%, rgba(228, 228, 231, 0.65) 100%)',
    buttonBorder: 'rgba(0, 0, 0, 0.08)',
    buttonText: '#27272a',
    fabGradient: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(228, 228, 231, 0.82) 48%, rgba(161, 161, 170, 0.55) 100%)',
    fabShadow: '0 10px 28px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(0, 0, 0, 0.06)',
    toggleOff: 'rgba(0, 0, 0, 0.12)',
    toggleOn: 'rgba(39, 39, 42, 0.82)',
    danger: 'rgba(254, 242, 242, 0.82)',
    dangerGradient: 'linear-gradient(180deg, rgba(254, 226, 226, 0.95) 0%, rgba(254, 202, 202, 0.75) 100%)',
    dangerBorder: 'rgba(248, 113, 113, 0.45)',
    dangerText: '#991b1b',
  },
} as const;

const glassBlur: Pick<React.CSSProperties, 'backdropFilter' | 'WebkitBackdropFilter'> = {
  backdropFilter: 'blur(22px) saturate(1.35)',
  WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
};

const getColors = (theme: DevToolbarTheme) => palette[theme];

export interface DevToolbarTab {
  id: string;
  label: string;
  icon?: ComponentType<{ size?: number | string; className?: string }>;
  content: ReactNode | (() => ReactNode);
}

export interface DevToolbarProps {
  tabs: DevToolbarTab[];
  position?: DevToolbarPosition;
  defaultTab?: string;
  activeTab?: string;
  onActiveTabChange?: (tabId: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  hideInProduction?: boolean;
  environment?: 'development' | 'staging' | 'production' | string;
  customIcon?: ReactNode;
  title?: string;
  width?: string;
  maxHeight?: string;
  defaultPaneHeight?: string;
  paneHeight?: string;
  onPaneHeightChange?: (height: string) => void;
}

export interface DevToolbarPersistedState {
  open?: boolean;
  activeTab?: string;
  position?: DevToolbarPosition;
  paneHeight?: string;
}

export interface UseDevToolbarPersistenceOptions {
  key?: string;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
}

const loadPersistedState = (
  key: string,
  storage?: Pick<Storage, 'getItem' | 'setItem'>
): DevToolbarPersistedState => {
  if (!storage) return {};

  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as DevToolbarPersistedState) : {};
  } catch {
    return {};
  }
};

export const useDevToolbarPersistence = (
  options: UseDevToolbarPersistenceOptions = {}
) => {
  const key = options.key ?? 'devbar';
  const storage = options.storage ?? (
    typeof window !== 'undefined' ? window.localStorage : undefined
  );

  const [state, setState] = useState<DevToolbarPersistedState>(() =>
    loadPersistedState(key, storage)
  );

  useEffect(() => {
    if (!storage) return;

    try {
      storage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota and private-mode storage errors.
    }
  }, [key, state, storage]);

  const onOpenChange = useCallback((open: boolean) => {
    setState((current) => ({ ...current, open }));
  }, []);

  const onActiveTabChange = useCallback((activeTab: string) => {
    setState((current) => ({ ...current, activeTab }));
  }, []);

  const onPositionChange = useCallback((position: DevToolbarPosition) => {
    setState((current) => ({ ...current, position }));
  }, []);

  const onPaneHeightChange = useCallback((paneHeight: string) => {
    setState((current) => ({ ...current, paneHeight }));
  }, []);

  return {
    state,
    setState,
    open: state.open,
    onOpenChange,
    activeTab: state.activeTab,
    onActiveTabChange,
    position: state.position,
    onPositionChange,
    paneHeight: state.paneHeight,
    onPaneHeightChange,
  };
};

const DevToolbarComponent: React.FC<DevToolbarProps> = ({
  tabs,
  position = 'bottom-right',
  defaultTab,
  activeTab: controlledActiveTab,
  onActiveTabChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className = '',
  theme = 'auto',
  hideInProduction = true,
  environment,
  customIcon,
  title = 'Dev',
  width = '280px',
  maxHeight = '220px',
  defaultPaneHeight = '300px',
  paneHeight: controlledPaneHeight,
  onPaneHeightChange,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(!defaultOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [internalPaneHeight, setInternalPaneHeight] = useState(defaultPaneHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(JBM_FONT_LINK_ID)) return;

    const link = document.createElement('link');
    link.id = JBM_FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  const isCollapsed = controlledOpen !== undefined ? !controlledOpen : internalCollapsed;
  const currentActiveTab = controlledActiveTab ?? internalActiveTab;
  const paneHeight = controlledPaneHeight ?? internalPaneHeight;

  const setCollapsed = useCallback((collapsed: boolean) => {
    if (controlledOpen === undefined) {
      setInternalCollapsed(collapsed);
    }
    onOpenChange?.(!collapsed);
  }, [controlledOpen, onOpenChange]);

  const setCurrentActiveTab = useCallback((tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onActiveTabChange?.(tabId);
  }, [controlledActiveTab, onActiveTabChange]);

  const setPaneHeight = useCallback((height: string) => {
    if (controlledPaneHeight === undefined) {
      setInternalPaneHeight(height);
    }
    onPaneHeightChange?.(height);
  }, [controlledPaneHeight, onPaneHeightChange]);

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(
    theme === 'auto' ? 'dark' : theme
  );

  useEffect(() => {
    if (theme !== 'auto') {
      setActualTheme(theme);
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setActualTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setActualTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const isWide = position === 'pane' || isExpanded;
  const colors = getColors(actualTheme);

  const toolbarContext = useMemo<DevToolbarContextValue>(() => ({
    theme: actualTheme,
    position,
    isExpanded,
    isOpen: !isCollapsed,
    isWide,
  }), [actualTheme, position, isExpanded, isCollapsed, isWide]);

  const isVisible = useMemo(() => {
    if (!isMounted) return false;

    // If hideInProduction is false, always show
    if (!hideInProduction) return true;
    
    // Use explicit environment prop if provided
    if (environment) {
      return environment !== 'production';
    }
    
    // Fall back to NODE_ENV only if no environment prop provided
    // Safely check for process.env without TypeScript errors
    try {
      // @ts-ignore - process may not exist in some environments
      const nodeEnv = typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined;
      if (nodeEnv) {
        return nodeEnv !== 'production';
      }
    } catch {
      // process is not defined, continue
    }
    
    // Default to showing if we can't determine environment
    return true;
  }, [isMounted, hideInProduction, environment]);
  
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
        setCollapsed(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [position, isCollapsed, setCollapsed]);
  
  if (!isMounted || !isVisible) {
    return null;
  }
  
  // Button positioned with minimal spacing (8px from edges)
  const buttonStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { 
      position: 'fixed' as const, 
      bottom: '8px',
      right: '8px',
      zIndex: 9999,
    },
    'bottom-left': { 
      position: 'fixed' as const, 
      bottom: '8px',
      left: '8px',
      zIndex: 9999,
    },
    'top-right': { 
      position: 'fixed' as const, 
      top: '8px',
      right: '8px',
      zIndex: 9999,
    },
    'top-left': { 
      position: 'fixed' as const, 
      top: '8px',
      left: '8px',
      zIndex: 9999,
    },
    'pane': { 
      position: 'fixed' as const, 
      bottom: '8px',
      right: '8px',
      zIndex: 9999,
    },
  };
  
  const panelBase: React.CSSProperties = {
    backgroundColor: colors.panel,
    backgroundImage: colors.panelGradient,
    ...glassBlur,
    color: colors.text,
    boxShadow: `${colors.shadow}, ${colors.sheen}`,
  };

  const panelStyles: Record<string, React.CSSProperties> = {
    'bottom-right': {
      position: 'fixed',
      bottom: '8px',
      right: '8px',
      borderRadius: isWide ? '4px' : '3px',
      ...panelBase,
    },
    'bottom-left': {
      position: 'fixed',
      bottom: '8px',
      left: '8px',
      borderRadius: isWide ? '4px' : '3px',
      ...panelBase,
    },
    'top-right': {
      position: 'fixed',
      top: '8px',
      right: '8px',
      borderRadius: isWide ? '4px' : '3px',
      ...panelBase,
    },
    'top-left': {
      position: 'fixed',
      top: '8px',
      left: '8px',
      borderRadius: isWide ? '4px' : '3px',
      ...panelBase,
    },
    'pane': {
      position: 'fixed',
      bottom: isCollapsed ? '-100%' : '0',
      left: '0',
      right: '0',
      borderRadius: '0',
      borderTop: `1px solid ${colors.glassBorder}`,
      ...panelBase,
    },
  };
  
  const activeTabContent = tabs.find(tab => tab.id === currentActiveTab);
  
  return (
    <>
      {/* Bug button - always visible */}
      <button
        onClick={() => setCollapsed(isCollapsed)}
        style={{
          ...buttonStyles[position],
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          backgroundColor: colors.panel,
          backgroundImage: colors.fabGradient,
          ...glassBlur,
          border: `1px solid ${colors.glassBorder}`,
          outline: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: colors.fabShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = `${colors.fabShadow}, 0 0 20px rgba(255, 255, 255, 0.08)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = colors.fabShadow;
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
              color: colors.textMuted,
            }}
            suppressHydrationWarning
            aria-hidden="true"
          />
        )}
      </button>
      
      {/* Dev toolbar panel */}
      {!isCollapsed && (
        <div
             className={className}
             style={{ 
               ...panelStyles[position], 
               width: position === 'pane' ? '100%' : (isExpanded ? '80%' : width), 
               maxWidth: position === 'pane' ? '100%' : (isExpanded ? '1200px' : '600px'),
               height: position === 'pane' ? paneHeight : (isExpanded ? '70vh' : maxHeight),
               maxHeight: position === 'pane' ? paneHeight : (isExpanded ? '800px' : maxHeight),
               minHeight: isWide ? '180px' : undefined,
               transition: position === 'pane' 
                 ? 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                 : 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               display: 'flex',
               flexDirection: 'column',
               overflow: 'hidden',
               zIndex: 9998,
               ...(position !== 'pane' ? {
                 borderTop: `1px solid ${colors.glassBorder}`,
                 borderRight: `1px solid ${colors.glassBorder}`,
                 borderBottom: `1px solid ${colors.glassBorder}`,
                 borderLeft: `1px solid ${colors.glassBorder}`,
               } : {}),
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
                e.currentTarget.style.backgroundColor = colors.tabHover;
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
            backgroundColor: colors.header,
            backgroundImage: colors.headerGradient,
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            paddingLeft: '10px',
            paddingRight: '6px',
            height: isWide ? '32px' : '28px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '1px',
                backgroundColor: colors.headerDot,
                flexShrink: 0,
              }} />
              <h3 style={{ 
                ...typography.title,
                color: colors.textMuted,
                margin: 0,
              }}>{title}</h3>
            </div>
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
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    color: actualTheme === 'light' ? '#9ca3af' : '#6b7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = actualTheme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = actualTheme === 'light' ? '#374151' : '#e5e7eb';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = actualTheme === 'light' ? '#9ca3af' : '#6b7280';
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
                onClick={() => setCollapsed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                padding: '5px',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                color: actualTheme === 'light' ? '#9ca3af' : '#6b7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = actualTheme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = actualTheme === 'light' ? '#374151' : '#e5e7eb';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = actualTheme === 'light' ? '#9ca3af' : '#6b7280';
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
          
          {/* Tabs */}
          {tabs.length > 1 && (
            <div style={{ 
              display: 'flex',
              alignItems: 'stretch',
              gap: isWide ? '4px' : '0',
              padding: isWide ? '6px 10px 0' : '0',
              borderBottom: `1px solid ${colors.border}`,
              overflowX: 'auto',
              flexShrink: 0,
              scrollbarWidth: 'none',
            }}>
              {tabs.map(({ id, label, icon }) => {
                const Icon = icon;
                const isActive = currentActiveTab === id;
                return (
                <button
                  key={id}
                  onClick={() => setCurrentActiveTab(id)}
                  style={{
                    flex: isWide ? '0 0 auto' : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: isWide ? '6px 12px' : '8px 10px',
                    minWidth: isWide ? 'max-content' : undefined,
                    ...typography.tab,
                    backgroundColor: isActive ? colors.tabActive : 'transparent',
                    backgroundImage: isActive ? colors.tabActiveGradient : 'none',
                    color: isActive ? colors.text : colors.textDim,
                    boxShadow: isActive ? colors.sheen : 'none',
                    borderTop: isWide
                      ? `1px solid ${isActive ? colors.glassBorder : 'transparent'}`
                      : 'none',
                    borderLeft: isWide
                      ? `1px solid ${isActive ? colors.glassBorder : 'transparent'}`
                      : 'none',
                    borderRight: isWide
                      ? `1px solid ${isActive ? colors.glassBorder : 'transparent'}`
                      : 'none',
                    borderBottom: isWide
                      ? 'none'
                      : `2px solid ${isActive ? colors.tabIndicator : 'transparent'}`,
                    borderRadius: isWide ? '2px 2px 0 0' : 0,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.tabHover;
                      e.currentTarget.style.backgroundImage = 'none';
                      e.currentTarget.style.color = colors.textMuted;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.backgroundImage = 'none';
                      e.currentTarget.style.color = colors.textDim;
                    }
                  }}
                >
                  {Icon && <Icon size={12} />}
                  <span>{label}</span>
                </button>
              )})}
            </div>
          )}
          
          {/* Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
            backgroundColor: colors.content,
            backgroundImage: colors.contentGradient,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          }}>
            <DevToolbarContext.Provider value={toolbarContext}>
              <div style={{
                padding: isWide ? '14px' : '10px',
                display: isWide ? 'grid' : 'block',
                gridTemplateColumns: isWide ? 'repeat(auto-fill, minmax(240px, 1fr))' : undefined,
                gap: isWide ? '10px' : undefined,
                alignContent: 'start',
              }}>
                {activeTabContent && (
                  typeof activeTabContent.content === 'function'
                    ? activeTabContent.content()
                    : activeTabContent.content
                )}
              </div>
            </DevToolbarContext.Provider>
          </div>
        </div>
      )}
    </>
  );
};

// Export with React.memo for performance optimization
export const DevToolbar = React.memo(DevToolbarComponent);

// Export a simple hook for creating toolbar tabs
export const useDevToolbarTab = (
  id: string,
  label: string,
  icon: ComponentType<{ size?: number | string; className?: string }> | undefined,
  content: ReactNode | (() => ReactNode)
): DevToolbarTab => {
  return { id, label, icon, content };
};

// Export utility components for consistent styling
export const DevToolbarSection: React.FC<{ 
  title?: string; 
  children: ReactNode;
  className?: string;
  theme?: DevToolbarTheme;
}> = ({ title, children, className = '', theme }) => {
  const effectiveTheme = useDevToolbarTheme(theme);
  const colors = getColors(effectiveTheme);
  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.card,
        backgroundImage: colors.cardGradient,
        ...glassBlur,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '3px',
        padding: '10px 12px',
        boxShadow: colors.sheen,
      }}
    >
      {title && (
        <div style={{ 
          ...typography.sectionTitle,
          marginBottom: '8px',
          paddingBottom: '6px',
          borderBottom: `1px solid ${colors.border}`,
          color: colors.textMuted,
        }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {children}
      </div>
    </div>
  );
};

export const DevToolbarButton: React.FC<{
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  size?: 'sm' | 'xs';
  children: ReactNode;
  className?: string;
}> = ({ onClick, variant = 'default', size = 'xs', children, className = '' }) => {
  const theme = useDevToolbarTheme();
  const colors = getColors(theme);

  const neutralButton: React.CSSProperties = {
    backgroundColor: colors.button,
    backgroundImage: colors.buttonGradient,
    border: `1px solid ${colors.buttonBorder}`,
    color: colors.buttonText,
    boxShadow: colors.sheen,
  };

  const baseStyles = variant === 'danger'
    ? {
        backgroundColor: colors.danger,
        backgroundImage: colors.dangerGradient,
        border: `1px solid ${colors.dangerBorder}`,
        color: colors.dangerText,
        boxShadow: colors.sheen,
      }
    : neutralButton;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        ...typography.button[size],
        ...baseStyles,
        borderRadius: '2px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        padding: size === 'xs' ? '5px 10px' : '7px 14px',
        transition: 'transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease',
        transform: isPressed ? 'translateY(1px)' : isHovered ? 'translateY(-1px)' : 'none',
        filter: isHovered ? 'brightness(1.06)' : 'none',
        boxShadow: isPressed
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.28)'
          : isHovered
          ? `${colors.sheen}, 0 6px 16px rgba(0, 0, 0, 0.2)`
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
  theme?: DevToolbarTheme;
}> = ({ label, value, className = '', theme }) => {
  const effectiveTheme = useDevToolbarTheme(theme);
  const colors = getColors(effectiveTheme);
  return (
    <div
      className={className}
      style={{
        ...typography.info,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '5px 0',
        borderBottom: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      <span style={{ color: colors.textDim }}>{label}</span>
      <span style={{
        color: colors.textMuted,
        fontWeight: 500,
        textAlign: 'right',
        wordBreak: 'break-word',
      }}>
        {String(value)}
      </span>
    </div>
  );
};

export const DevToolbarToggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  theme?: DevToolbarTheme;
}> = ({ checked, onChange, label, className = '', theme }) => {
  const effectiveTheme = useDevToolbarTheme(theme);
  const colors = getColors(effectiveTheme);
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '5px 0',
        borderBottom: `1px solid ${colors.border}`,
        ...typography.info,
      }}
    >
      {label && (
        <span style={{ color: colors.textDim, flex: 1 }}>{label}</span>
      )}
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          height: '22px',
          width: '40px',
          borderRadius: '3px',
          backgroundColor: checked ? colors.toggleOn : colors.toggleOff,
          backgroundImage: checked
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(212, 212, 216, 0.85) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.18) 100%)',
          transition: 'background-color 0.2s ease, background-image 0.2s ease',
          border: `1px solid ${colors.glassBorder}`,
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.22)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '2px',
            backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(228, 228, 231, 0.95) 100%)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
            transition: 'transform 0.2s ease',
            transform: checked ? 'translateX(20px)' : 'translateX(3px)',
          }}
        />
      </button>
    </div>
  );
};