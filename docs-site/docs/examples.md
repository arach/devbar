# Examples

Common use cases and code recipes for @arach/devbar.

## State Inspector

Monitor and modify application state in real-time:

```tsx
import { DevToolbar, DevToolbarSection, DevToolbarInfo, DevToolbarButton } from '@arach/devbar';
import { Database } from 'lucide-react';
import { useAppState } from './store';

function App() {
  const state = useAppState();
  
  const tabs = [
    {
      id: 'state',
      label: 'State',
      icon: Database,
      content: (
        <>
          <DevToolbarSection title="User State">
            <DevToolbarInfo label="User ID" value={state.user?.id || 'None'} />
            <DevToolbarInfo label="Role" value={state.user?.role || 'Guest'} />
            <DevToolbarInfo label="Authenticated" value={state.isAuthenticated} />
          </DevToolbarSection>
          
          <DevToolbarSection title="App State">
            <pre style={{ 
              fontSize: '0.7rem', 
              backgroundColor: '#1f2937',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </DevToolbarSection>
          
          <DevToolbarSection title="Actions">
            <div style={{ display: 'flex', gap: '8px' }}>
              <DevToolbarButton 
                onClick={() => state.reset()}
                variant="danger"
                size="xs"
              >
                Reset State
              </DevToolbarButton>
              <DevToolbarButton 
                onClick={() => state.refresh()}
                variant="primary"
                size="xs"
              >
                Refresh
              </DevToolbarButton>
            </div>
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return (
    <>
      <YourApp />
      <DevToolbar tabs={tabs} />
    </>
  );
}
```

## Feature Flags

Toggle features on/off during development:

```tsx
import { DevToolbar, DevToolbarSection, DevToolbarToggle } from '@arach/devbar';
import { ToggleLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

function FeatureFlagsToolbar() {
  const [features, setFeatures] = useState({
    newUI: false,
    experimentalAPI: false,
    debugMode: false,
    mockData: false,
    performanceMode: false
  });
  
  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('devFeatures');
    if (saved) setFeatures(JSON.parse(saved));
  }, []);
  
  useEffect(() => {
    localStorage.setItem('devFeatures', JSON.stringify(features));
    // Apply features to window for global access
    window.__FEATURES__ = features;
  }, [features]);
  
  const toggleFeature = (key: string) => {
    setFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const tabs = [
    {
      id: 'features',
      label: 'Features',
      icon: ToggleLeft,
      content: (
        <>
          <DevToolbarSection title="UI Features">
            <DevToolbarToggle
              label="New UI Design"
              checked={features.newUI}
              onChange={() => toggleFeature('newUI')}
            />
            <DevToolbarToggle
              label="Debug Mode"
              checked={features.debugMode}
              onChange={() => toggleFeature('debugMode')}
            />
          </DevToolbarSection>
          
          <DevToolbarSection title="API Features">
            <DevToolbarToggle
              label="Experimental API"
              checked={features.experimentalAPI}
              onChange={() => toggleFeature('experimentalAPI')}
            />
            <DevToolbarToggle
              label="Mock Data"
              checked={features.mockData}
              onChange={() => toggleFeature('mockData')}
            />
          </DevToolbarSection>
          
          <DevToolbarSection title="Performance">
            <DevToolbarToggle
              label="Performance Mode"
              checked={features.performanceMode}
              onChange={() => toggleFeature('performanceMode')}
            />
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} title="Features" />;
}
```

## Performance Monitor

Track FPS, memory usage, and React renders:

```tsx
import { DevToolbar, DevToolbarSection, DevToolbarInfo } from '@arach/devbar';
import { Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function PerformanceToolbar() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renders: 0,
    loadTime: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderCount = useRef(0);
  
  useEffect(() => {
    // Track FPS
    const measureFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;
      
      if (delta >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount.current * 1000) / delta),
          memory: performance.memory?.usedJSHeapSize 
            ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
            : 0,
          renders: renderCount.current
        }));
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    const animationId = requestAnimationFrame(measureFPS);
    
    // Track page load time
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    }
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  // Increment render counter
  useEffect(() => {
    renderCount.current++;
  });
  
  const tabs = [
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      content: () => (
        <>
          <DevToolbarSection title="Live Metrics">
            <DevToolbarInfo 
              label="FPS" 
              value={`${metrics.fps} fps`}
            />
            <DevToolbarInfo 
              label="Memory" 
              value={`${metrics.memory} MB`}
            />
            <DevToolbarInfo 
              label="Renders" 
              value={metrics.renders}
            />
            <DevToolbarInfo 
              label="Page Load" 
              value={`${metrics.loadTime}ms`}
            />
          </DevToolbarSection>
          
          <DevToolbarSection title="Performance Tips">
            {metrics.fps < 30 && (
              <div style={{ color: '#ef4444', fontSize: '0.7rem' }}>
                ⚠️ Low FPS detected. Check for heavy computations.
              </div>
            )}
            {metrics.memory > 100 && (
              <div style={{ color: '#f59e0b', fontSize: '0.7rem' }}>
                ⚠️ High memory usage. Consider optimizing data structures.
              </div>
            )}
            {metrics.fps >= 30 && metrics.memory <= 100 && (
              <div style={{ color: '#10b981', fontSize: '0.7rem' }}>
                ✓ Performance looks good!
              </div>
            )}
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} position="bottom-left" />;
}
```

## API Mock Control

Control mock API responses and delays:

```tsx
import { DevToolbar, DevToolbarSection, DevToolbarToggle, DevToolbarButton } from '@arach/devbar';
import { Globe } from 'lucide-react';
import { useState } from 'react';

// Mock API configuration
const mockConfig = {
  enabled: false,
  delay: 0,
  failureRate: 0,
  responses: {}
};

function APIToolbar() {
  const [apiConfig, setApiConfig] = useState({
    useMocks: false,
    delay: 0,
    failureRate: 0,
    scenario: 'default'
  });
  
  const scenarios = {
    default: 'Normal responses',
    empty: 'Empty data sets',
    error: 'Error responses',
    slow: 'Slow network (3s delay)',
    offline: 'Offline mode'
  };
  
  const applyScenario = (scenario: string) => {
    let config = { ...apiConfig, scenario };
    
    switch (scenario) {
      case 'slow':
        config.delay = 3000;
        break;
      case 'error':
        config.failureRate = 100;
        break;
      case 'offline':
        config.useMocks = true;
        config.failureRate = 100;
        break;
      default:
        config.delay = 0;
        config.failureRate = 0;
    }
    
    setApiConfig(config);
    
    // Apply to global mock config
    window.__MOCK_API__ = config;
  };
  
  const tabs = [
    {
      id: 'api',
      label: 'API',
      icon: Globe,
      content: (
        <>
          <DevToolbarSection title="Mock Settings">
            <DevToolbarToggle
              label="Use Mock API"
              checked={apiConfig.useMocks}
              onChange={(checked) => setApiConfig(prev => ({ ...prev, useMocks: checked }))}
            />
            <DevToolbarInfo label="Delay" value={`${apiConfig.delay}ms`} />
            <DevToolbarInfo label="Failure Rate" value={`${apiConfig.failureRate}%`} />
          </DevToolbarSection>
          
          <DevToolbarSection title="Scenarios">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.entries(scenarios).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => applyScenario(key)}
                  style={{
                    padding: '6px 8px',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    border: '1px solid #374151',
                    backgroundColor: apiConfig.scenario === key ? '#1f2937' : 'transparent',
                    color: '#e5e7eb',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </DevToolbarSection>
          
          <DevToolbarSection title="Actions">
            <DevToolbarButton
              onClick={() => {
                fetch('/api/cache/clear', { method: 'POST' });
                console.log('Cache cleared');
              }}
              variant="warning"
            >
              Clear API Cache
            </DevToolbarButton>
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} />;
}
```

## Console Output

Display console logs within your app:

```tsx
import { DevToolbar, DevToolbarSection } from '@arach/devbar';
import { Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

function ConsoleToolbar() {
  const [logs, setLogs] = useState<Array<{
    type: string;
    message: string;
    timestamp: string;
  }>>([]);
  
  useEffect(() => {
    // Intercept console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const addLog = (type: string, args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-50), {
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };
    
    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args);
    };
    
    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };
    
    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);
  
  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      default: return '#9ca3af';
    }
  };
  
  const tabs = [
    {
      id: 'console',
      label: 'Console',
      icon: Terminal,
      content: (
        <DevToolbarSection title="Output">
          <div style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '4px',
            padding: '8px',
            maxHeight: '300px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            lineHeight: '1.4'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: '#6b7280' }}>No console output yet...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '4px' }}>
                  <span style={{ color: '#6b7280' }}>[{log.timestamp}]</span>
                  <span style={{ color: getLogColor(log.type), marginLeft: '8px' }}>
                    {log.type.toUpperCase()}:
                  </span>
                  <span style={{ color: '#e5e7eb', marginLeft: '8px' }}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <DevToolbarButton
              onClick={() => setLogs([])}
              variant="danger"
              size="xs"
            >
              Clear
            </DevToolbarButton>
            <DevToolbarButton
              onClick={() => console.log('Test log message')}
              variant="default"
              size="xs"
            >
              Test Log
            </DevToolbarButton>
          </div>
        </DevToolbarSection>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} position="pane" defaultPaneHeight="250px" />;
}
```

## Multi-Tab Dashboard

Complete development dashboard with multiple tools:

```tsx
import { DevToolbar } from '@arach/devbar';
import { 
  Settings, 
  Activity, 
  Database, 
  Globe, 
  Terminal,
  ToggleLeft,
  User
} from 'lucide-react';

function DevelopmentDashboard() {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
      content: <OverviewPanel />
    },
    {
      id: 'state',
      label: 'State',
      icon: Database,
      content: <StateInspector />
    },
    {
      id: 'features',
      label: 'Features',
      icon: ToggleLeft,
      content: <FeatureFlags />
    },
    {
      id: 'api',
      label: 'API',
      icon: Globe,
      content: <APIControls />
    },
    {
      id: 'console',
      label: 'Console',
      icon: Terminal,
      content: <ConsoleOutput />
    },
    {
      id: 'user',
      label: 'User',
      icon: User,
      content: <UserSimulator />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: <AppSettings />
    }
  ];
  
  return (
    <DevToolbar
      tabs={tabs}
      position="pane"
      defaultPaneHeight="400px"
      title="Dev Tools"
      theme="dark"
      hideInProduction={false} // Show in staging
    />
  );
}
```

## Environment Switcher

Switch between different API environments:

```tsx
import { DevToolbar, DevToolbarSection, DevToolbarInfo } from '@arach/devbar';
import { Cloud } from 'lucide-react';

function EnvironmentToolbar() {
  const [currentEnv, setCurrentEnv] = useState('development');
  
  const environments = {
    development: {
      api: 'http://localhost:3000',
      color: '#10b981'
    },
    staging: {
      api: 'https://staging-api.example.com',
      color: '#f59e0b'
    },
    production: {
      api: 'https://api.example.com',
      color: '#ef4444'
    }
  };
  
  const switchEnvironment = (env: string) => {
    setCurrentEnv(env);
    // Update API base URL
    window.__API_BASE__ = environments[env].api;
    // Reload app or update API client
    window.location.reload();
  };
  
  const tabs = [
    {
      id: 'env',
      label: 'Environment',
      icon: Cloud,
      content: (
        <>
          <DevToolbarSection title="Current Environment">
            <div style={{
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: environments[currentEnv].color + '20',
              border: `1px solid ${environments[currentEnv].color}`,
              marginBottom: '12px'
            }}>
              <DevToolbarInfo label="Environment" value={currentEnv} />
              <DevToolbarInfo label="API URL" value={environments[currentEnv].api} />
            </div>
          </DevToolbarSection>
          
          <DevToolbarSection title="Switch Environment">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.entries(environments).map(([env, config]) => (
                <button
                  key={env}
                  onClick={() => switchEnvironment(env)}
                  disabled={env === currentEnv}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${config.color}`,
                    backgroundColor: env === currentEnv ? config.color + '20' : 'transparent',
                    color: '#e5e7eb',
                    cursor: env === currentEnv ? 'default' : 'pointer',
                    opacity: env === currentEnv ? 0.7 : 1
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{env}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>{config.api}</div>
                </button>
              ))}
            </div>
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} position="top-right" />;
}
```

## Usage Tips

1. **Combine Multiple Examples**: Mix and match features from different examples
2. **Persist Settings**: Use localStorage to remember user preferences
3. **Global Access**: Expose configuration to window object for app-wide access
4. **Performance**: Use React.memo() and useCallback() for heavy content
5. **Responsive**: Test different positions and sizes for your use case