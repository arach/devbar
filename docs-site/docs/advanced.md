# Advanced Usage

Deep dive into advanced features and techniques for @arach/devbar.

## Pane Mode

The pane mode transforms the toolbar into a Chrome DevTools-style bottom panel, perfect for complex debugging scenarios.

### Basic Pane Setup

```tsx
<DevToolbar
  tabs={tabs}
  position="pane"
  defaultPaneHeight="350px"  // Initial height
  defaultOpen={false}         // Start closed
/>
```

### Resizable Pane

The pane mode includes a drag handle at the top for resizing:

```tsx
function ResizablePaneExample() {
  const [paneHeight, setPaneHeight] = useState('300px');
  
  // Height persists across sessions
  useEffect(() => {
    const saved = localStorage.getItem('devbarPaneHeight');
    if (saved) setPaneHeight(saved);
  }, []);
  
  // Listen for resize events (if you need to track them)
  useEffect(() => {
    const handleResize = () => {
      // The toolbar handles resizing internally
      // This is just if you need to know when it happens
      const toolbar = document.querySelector('[data-devbar-pane]');
      if (toolbar) {
        const height = toolbar.getBoundingClientRect().height;
        localStorage.setItem('devbarPaneHeight', `${height}px`);
      }
    };
    
    window.addEventListener('mouseup', handleResize);
    return () => window.removeEventListener('mouseup', handleResize);
  }, []);
  
  return (
    <DevToolbar
      tabs={tabs}
      position="pane"
      defaultPaneHeight={paneHeight}
    />
  );
}
```

### Pane Mode Characteristics

- **Full Width**: Spans entire viewport width
- **Resizable**: Drag the top edge to resize (100px min, 80% viewport max)
- **Slide Animation**: Smooth slide-in/out from bottom
- **ESC to Close**: Press ESC key to quickly close
- **No Expand Button**: Always full width, no expand/collapse mode

## Keyboard Shortcuts

### Built-in Shortcuts

The toolbar includes these keyboard shortcuts:

| Shortcut | Action | Context |
|----------|--------|---------|
| ESC | Close toolbar | Pane mode only |
| Tab | Navigate elements | All modes |
| Enter/Space | Activate buttons | All modes |

### Custom Keyboard Shortcuts

Add your own keyboard shortcuts to control the toolbar:

```tsx
function KeyboardControlledToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + D to toggle toolbar
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      // Cmd/Ctrl + 1-9 to switch tabs
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabIds = ['overview', 'state', 'api', 'console'];
        if (tabIds[tabIndex]) {
          setActiveTab(tabIds[tabIndex]);
        }
      }
      
      // Alt + Arrow keys to change position
      if (e.altKey) {
        if (e.key === 'ArrowUp') setPosition('top-right');
        if (e.key === 'ArrowDown') setPosition('bottom-right');
        if (e.key === 'ArrowLeft') setPosition('bottom-left');
        if (e.key === 'ArrowRight') setPosition('bottom-right');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <DevToolbar
      tabs={tabs}
      defaultOpen={isOpen}
      defaultTab={activeTab}
      key={`${isOpen}-${activeTab}`} // Force re-render
    />
  );
}
```

### Global Command Palette

Create a command palette to control the toolbar:

```tsx
function CommandPaletteIntegration() {
  const [showPalette, setShowPalette] = useState(false);
  
  const commands = [
    { id: 'toggle', label: 'Toggle DevBar', shortcut: '⌘⇧D' },
    { id: 'pane', label: 'Switch to Pane Mode', shortcut: '⌘⇧P' },
    { id: 'corner', label: 'Switch to Corner Mode', shortcut: '⌘⇧C' },
    { id: 'theme', label: 'Toggle Theme', shortcut: '⌘⇧T' },
  ];
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      {showPalette && (
        <CommandPalette
          commands={commands}
          onCommand={(cmd) => {
            // Handle commands
            switch(cmd.id) {
              case 'toggle':
                // Toggle toolbar
                break;
              case 'pane':
                // Switch to pane mode
                break;
              // etc...
            }
            setShowPalette(false);
          }}
          onClose={() => setShowPalette(false)}
        />
      )}
      <DevToolbar tabs={tabs} />
    </>
  );
}
```

## Dynamic Resizing

### Responsive Panel Size

Adjust panel size based on content or viewport:

```tsx
function ResponsiveToolbar() {
  const [dimensions, setDimensions] = useState({
    width: '320px',
    height: '400px'
  });
  
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Responsive sizing based on viewport
      if (vw < 640) {
        // Mobile
        setDimensions({
          width: '90vw',
          height: '50vh'
        });
      } else if (vw < 1024) {
        // Tablet
        setDimensions({
          width: '400px',
          height: '450px'
        });
      } else {
        // Desktop
        setDimensions({
          width: '450px',
          height: '500px'
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <DevToolbar
      tabs={tabs}
      width={dimensions.width}
      maxHeight={dimensions.height}
    />
  );
}
```

### Content-Aware Sizing

Adjust size based on active tab content:

```tsx
function ContentAwareSizing() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Different sizes for different tabs
  const tabSizes = {
    overview: { width: '320px', height: '300px' },
    state: { width: '500px', height: '600px' },
    console: { width: '600px', height: '400px' },
    metrics: { width: '400px', height: '500px' }
  };
  
  const currentSize = tabSizes[activeTab] || tabSizes.overview;
  
  return (
    <DevToolbar
      tabs={tabs}
      defaultTab={activeTab}
      width={currentSize.width}
      maxHeight={currentSize.height}
      key={activeTab} // Force re-render with new size
    />
  );
}
```

## Performance Optimization

### Lazy Loading Heavy Content

Load expensive components only when needed:

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const DataGrid = lazy(() => import('./DataGrid'));

function OptimizedToolbar() {
  const tabs = [
    {
      id: 'charts',
      label: 'Charts',
      icon: BarChart,
      content: () => (
        <Suspense fallback={<div>Loading charts...</div>}>
          <HeavyChart />
        </Suspense>
      )
    },
    {
      id: 'data',
      label: 'Data',
      icon: Database,
      content: () => (
        <Suspense fallback={<div>Loading data...</div>}>
          <DataGrid />
        </Suspense>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} />;
}
```

### Debounced Updates

Prevent excessive re-renders with debouncing:

```tsx
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

function DebouncedToolbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      // Expensive search operation
      const filtered = performSearch(term);
      setResults(filtered);
    }, 300),
    []
  );
  
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);
  
  const tabs = [
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      content: (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
          />
          <div>
            {results.map(result => (
              <div key={result.id}>{result.name}</div>
            ))}
          </div>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} />;
}
```

### Virtual Scrolling

Handle large lists efficiently:

```tsx
import { FixedSizeList } from 'react-window';

function VirtualizedContent() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }));
  
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  const tabs = [
    {
      id: 'list',
      label: 'Large List',
      icon: List,
      content: (
        <FixedSizeList
          height={350}
          itemCount={items.length}
          itemSize={35}
          width="100%"
        >
          {Row}
        </FixedSizeList>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} />;
}
```

## Integration Patterns

### Redux DevTools Integration

Connect to Redux for state debugging:

```tsx
import { useSelector, useDispatch } from 'react-redux';

function ReduxToolbar() {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  
  const tabs = [
    {
      id: 'redux',
      label: 'Redux',
      icon: Database,
      content: (
        <>
          <DevToolbarSection title="State Tree">
            <pre style={{ fontSize: '0.65rem' }}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </DevToolbarSection>
          
          <DevToolbarSection title="Actions">
            <DevToolbarButton
              onClick={() => dispatch({ type: 'RESET' })}
              variant="danger"
            >
              Reset Store
            </DevToolbarButton>
            <DevToolbarButton
              onClick={() => {
                const action = prompt('Enter action type:');
                if (action) dispatch({ type: action });
              }}
              variant="primary"
            >
              Dispatch Custom
            </DevToolbarButton>
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} />;
}
```

### React Query Integration

Monitor and control React Query cache:

```tsx
import { useQueryClient } from '@tanstack/react-query';

function ReactQueryToolbar() {
  const queryClient = useQueryClient();
  const [queries, setQueries] = useState([]);
  
  useEffect(() => {
    const updateQueries = () => {
      const cache = queryClient.getQueryCache();
      setQueries(cache.getAll());
    };
    
    updateQueries();
    const unsubscribe = queryClient.getQueryCache().subscribe(updateQueries);
    
    return unsubscribe;
  }, [queryClient]);
  
  const tabs = [
    {
      id: 'queries',
      label: 'Queries',
      icon: Database,
      content: (
        <>
          <DevToolbarSection title="Active Queries">
            {queries.map(query => (
              <div key={query.queryHash}>
                <DevToolbarInfo 
                  label={query.queryKey.join(', ')}
                  value={query.state.status}
                />
              </div>
            ))}
          </DevToolbarSection>
          
          <DevToolbarSection title="Actions">
            <DevToolbarButton
              onClick={() => queryClient.invalidateQueries()}
              variant="warning"
            >
              Invalidate All
            </DevToolbarButton>
            <DevToolbarButton
              onClick={() => queryClient.clear()}
              variant="danger"
            >
              Clear Cache
            </DevToolbarButton>
          </DevToolbarSection>
        </>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} />;
}
```

## Custom Themes

### Creating Custom Color Schemes

Define your own theme beyond light/dark:

```tsx
function CustomThemeToolbar() {
  const [customTheme, setCustomTheme] = useState('cyberpunk');
  
  const themes = {
    cyberpunk: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#00ff00',
      border: '#ff00ff'
    },
    ocean: {
      background: 'linear-gradient(135deg, #667eea 0%, #4ca1af 100%)',
      text: '#ffffff',
      border: '#4ca1af'
    },
    sunset: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      text: '#ffffff',
      border: '#f5576c'
    }
  };
  
  const currentTheme = themes[customTheme];
  
  return (
    <div>
      <style>{`
        .custom-theme-toolbar > div:last-child {
          background: ${currentTheme.background} !important;
          color: ${currentTheme.text} !important;
          border-color: ${currentTheme.border} !important;
        }
      `}</style>
      
      <DevToolbar
        tabs={tabs}
        className="custom-theme-toolbar"
        theme="dark" // Base theme
      />
    </div>
  );
}
```

## Security Considerations

### Production Safety

Ensure sensitive data isn't exposed:

```tsx
function SecureToolbar() {
  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = window.location.hostname === 'localhost';
  const hasDebugToken = document.cookie.includes('debug_token=');
  
  // Multiple security checks
  const shouldShow = isDev || (isLocalhost && hasDebugToken);
  
  if (!shouldShow) return null;
  
  // Sanitize sensitive data
  const sanitizeData = (data: any) => {
    const sanitized = { ...data };
    if (sanitized.password) sanitized.password = '***';
    if (sanitized.apiKey) sanitized.apiKey = '***';
    if (sanitized.token) sanitized.token = '***';
    return sanitized;
  };
  
  const tabs = [
    {
      id: 'state',
      label: 'State',
      icon: Database,
      content: (
        <pre>
          {JSON.stringify(sanitizeData(appState), null, 2)}
        </pre>
      )
    }
  ];
  
  return <DevToolbar tabs={tabs} hideInProduction={true} />;
}
```

## Best Practices

1. **Pane Mode for Complex Tasks**: Use pane mode when you need more screen real estate
2. **Keyboard Shortcuts**: Implement shortcuts for power users
3. **Performance**: Lazy load heavy content and use memoization
4. **Security**: Always use `hideInProduction={true}` and sanitize sensitive data
5. **Persistence**: Save user preferences to localStorage
6. **Accessibility**: Ensure all custom content is keyboard navigable
7. **Testing**: Test with different viewport sizes and positions