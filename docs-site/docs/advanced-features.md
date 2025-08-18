# Advanced Features

Deep dive into the advanced capabilities of @arach/devbar.

## Pane Mode

The Chrome DevTools-style pane mode provides a full-width bottom panel for comprehensive debugging.

### Basic Pane Setup

```jsx
<DevToolbar 
  position="pane"
  defaultPaneHeight="350px"
  defaultOpen={true}
/>
```

### Resizable Panel

The pane mode includes a drag handle for resizing:

```jsx
// Users can:
// - Drag the top edge to resize
// - Minimum height: 100px
// - Maximum height: 80% of viewport
```

### Keyboard Shortcuts

| Key | Action | Mode |
|-----|--------|------|
| ESC | Close toolbar | Pane mode only |

```jsx
// The ESC handler is automatically enabled in pane mode
// No additional configuration needed
```

### Pane Mode Styling

```jsx
// Pane mode specific styles
const paneStyles = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  borderTop: '0.5px solid',
  boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
  borderRadius: 0  // No rounded corners
}
```

## Dynamic Content

### Function Render Props

Use functions for content that should re-render on each update:

```jsx
const tabs = [
  {
    id: 'dynamic',
    label: 'Live Data',
    icon: Activity,
    content: () => {
      // This function is called on every render
      const currentTime = new Date().toLocaleTimeString()
      const memoryUsage = performance.memory?.usedJSHeapSize
      
      return (
        <DevToolbarSection title="Live Metrics">
          <DevToolbarInfo label="Time" value={currentTime} />
          <DevToolbarInfo label="Memory" value={`${Math.round(memoryUsage / 1048576)} MB`} />
        </DevToolbarSection>
      )
    }
  }
]
```

### Lazy Loading Content

Defer expensive computations until tab is activated:

```jsx
const tabs = [
  {
    id: 'expensive',
    label: 'Analysis',
    icon: Database,
    content: () => {
      // Only runs when this tab is active
      const analysis = performExpensiveAnalysis()
      
      return (
        <DevToolbarSection title="Analysis Results">
          {analysis.map(item => (
            <DevToolbarInfo key={item.id} {...item} />
          ))}
        </DevToolbarSection>
      )
    }
  }
]
```

### Real-time Updates

```jsx
function RealtimeTab() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    
    ws.onmessage = (event) => {
      setData(prev => [...prev, JSON.parse(event.data)])
    }
    
    return () => ws.close()
  }, [])
  
  return {
    id: 'realtime',
    label: 'Live Feed',
    icon: Radio,
    content: (
      <DevToolbarSection title="WebSocket Messages">
        {data.map((msg, i) => (
          <div key={i}>{JSON.stringify(msg)}</div>
        ))}
      </DevToolbarSection>
    )
  }
}
```

## Expandable View

Corner positions support an expand/collapse feature:

### Expand Button

```jsx
// In corner positions, users see a maximize button
// Clicking expands the panel to:
// - Width: 80% (max 1200px)
// - Height: 70vh (max 800px)
```

### Programmatic Control

While there's no direct API for expansion, you can control dimensions:

```jsx
const [isExpanded, setIsExpanded] = useState(false)

<DevToolbar
  width={isExpanded ? "80%" : "320px"}
  maxHeight={isExpanded ? "70vh" : "400px"}
/>
```

## Custom Animations

### Transition Overrides

```jsx
// Custom CSS for animation timing
<style>
  {`
    .my-toolbar {
      transition: all 0.5s ease-in-out !important;
    }
    
    .my-toolbar button {
      transition: transform 0.1s ease !important;
    }
  `}
</style>

<DevToolbar className="my-toolbar" />
```

### Disable Animations

```jsx
// For accessibility or performance
<style>
  {`
    .no-animations * {
      animation: none !important;
      transition: none !important;
    }
  `}
</style>

<DevToolbar className="no-animations" />
```

## Performance Optimization

### Memoization

```jsx
import { useMemo, useCallback, memo } from 'react'

// Memoize expensive tab configurations
const tabs = useMemo(() => [
  {
    id: 'heavy',
    label: 'Heavy',
    icon: Database,
    content: <HeavyComponent />
  }
], [dependencies])

// Memoize content components
const MemoizedContent = memo(({ data }) => (
  <DevToolbarSection title="Data">
    {/* Expensive rendering */}
  </DevToolbarSection>
))

// Use callbacks for event handlers
const handleClick = useCallback(() => {
  // Handle click
}, [])
```

### Conditional Rendering

```jsx
// Only render heavy content when tab is active
const tabs = [
  {
    id: 'heavy',
    label: 'Heavy',
    icon: Database,
    content: function HeavyContent() {
      const [shouldRender, setShouldRender] = useState(false)
      
      useEffect(() => {
        // Delay heavy rendering
        const timer = setTimeout(() => setShouldRender(true), 100)
        return () => clearTimeout(timer)
      }, [])
      
      if (!shouldRender) {
        return <div>Loading...</div>
      }
      
      return <ExpensiveComponent />
    }
  }
]
```

### Virtual Scrolling

For long lists in toolbar content:

```jsx
import { FixedSizeList } from 'react-window'

const tabs = [
  {
    id: 'logs',
    label: 'Logs',
    icon: FileText,
    content: (
      <FixedSizeList
        height={300}
        itemCount={1000}
        itemSize={20}
        width="100%"
      >
        {({ index, style }) => (
          <div style={style}>
            Log entry {index}
          </div>
        )}
      </FixedSizeList>
    )
  }
]
```

## State Management

### External State Sync

```jsx
// Sync with Redux
import { useSelector, useDispatch } from 'react-redux'

function SyncedToolbar() {
  const toolbarState = useSelector(state => state.toolbar)
  const dispatch = useDispatch()
  
  return (
    <DevToolbar
      position={toolbarState.position}
      defaultOpen={toolbarState.isOpen}
      theme={toolbarState.theme}
      tabs={tabs}
    />
  )
}
```

### Local Storage Persistence

```jsx
function PersistentToolbar() {
  // Persist position
  const [position, setPosition] = useState(() => 
    localStorage.getItem('devbar-position') || 'bottom-right'
  )
  
  // Persist open state
  const [isOpen, setIsOpen] = useState(() => 
    localStorage.getItem('devbar-open') === 'true'
  )
  
  // Persist active tab
  const [activeTab, setActiveTab] = useState(() => 
    localStorage.getItem('devbar-tab') || 'overview'
  )
  
  // Persist pane height
  const [paneHeight, setPaneHeight] = useState(() => 
    localStorage.getItem('devbar-height') || '300px'
  )
  
  // Save changes
  useEffect(() => {
    localStorage.setItem('devbar-position', position)
    localStorage.setItem('devbar-open', String(isOpen))
    localStorage.setItem('devbar-tab', activeTab)
    localStorage.setItem('devbar-height', paneHeight)
  }, [position, isOpen, activeTab, paneHeight])
  
  return (
    <DevToolbar
      position={position}
      defaultOpen={isOpen}
      defaultTab={activeTab}
      defaultPaneHeight={paneHeight}
      tabs={tabs}
    />
  )
}
```

## Custom Integrations

### Browser DevTools Integration

```jsx
// Send data to browser console
const tabs = [
  {
    id: 'console',
    label: 'Console',
    icon: Terminal,
    content: (
      <DevToolbarSection title="Console Bridge">
        <DevToolbarButton onClick={() => {
          console.log('State:', appState)
          console.table(performanceMetrics)
        }}>
          Log to Browser Console
        </DevToolbarButton>
      </DevToolbarSection>
    )
  }
]
```

### Performance API Integration

```jsx
function PerformanceTab() {
  const [metrics, setMetrics] = useState({})
  
  useEffect(() => {
    // Navigation timing
    const navTiming = performance.getEntriesByType('navigation')[0]
    
    // Resource timing
    const resources = performance.getEntriesByType('resource')
    
    // Paint timing
    const paints = performance.getEntriesByType('paint')
    
    setMetrics({
      domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
      loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
      resources: resources.length,
      firstPaint: paints.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paints.find(p => p.name === 'first-contentful-paint')?.startTime
    })
  }, [])
  
  return {
    id: 'performance',
    label: 'Performance',
    icon: Activity,
    content: (
      <DevToolbarSection title="Performance Metrics">
        {Object.entries(metrics).map(([key, value]) => (
          <DevToolbarInfo 
            key={key}
            label={key}
            value={value ? `${Math.round(value)}ms` : 'N/A'}
          />
        ))}
      </DevToolbarSection>
    )
  }
}
```

### Service Worker Integration

```jsx
const tabs = [
  {
    id: 'sw',
    label: 'Service Worker',
    icon: Cloud,
    content: () => {
      const [swStatus, setSwStatus] = useState('checking...')
      
      useEffect(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
              setSwStatus(`Active: ${reg.active?.state || 'none'}`)
            } else {
              setSwStatus('Not registered')
            }
          })
        } else {
          setSwStatus('Not supported')
        }
      }, [])
      
      return (
        <DevToolbarSection title="Service Worker">
          <DevToolbarInfo label="Status" value={swStatus} />
          <DevToolbarButton onClick={() => {
            navigator.serviceWorker.getRegistration().then(reg => {
              reg?.update()
            })
          }}>
            Check for Updates
          </DevToolbarButton>
        </DevToolbarSection>
      )
    }
  }
]
```

## Accessibility

### ARIA Labels

All interactive elements include proper ARIA labels:

```jsx
// Built-in ARIA support
<button aria-label="Close toolbar" title="Close toolbar">
<button aria-label="Expand toolbar" title="Expand toolbar">
```

### Keyboard Navigation

The toolbar supports keyboard interaction:
- Tab navigation through buttons and tabs
- Enter/Space to activate buttons
- ESC to close (pane mode)

### Screen Reader Support

Use semantic HTML and ARIA attributes:

```jsx
const tabs = [
  {
    id: 'accessible',
    label: 'Status',
    icon: Info,
    content: (
      <div role="region" aria-label="Application Status">
        <DevToolbarSection title="Status Information">
          <div role="status" aria-live="polite">
            Current status: Active
          </div>
        </DevToolbarSection>
      </div>
    )
  }
]
```