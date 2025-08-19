# @arach/devbar

```bash
npm install @arach/devbar
```

```jsx
import { DevToolbar, DevToolbarSection, DevToolbarInfo, DevToolbarButton } from '@arach/devbar'

function App() {
  const [gameState, setGameState] = useState({ score: 0, moves: 0, bestScore: 0 })
  const [debugMode, setDebugMode] = useState(false)
  
  return (
    <>
      <YourGame />
      <DevToolbar 
        tabs={[
          {
            id: 'game',
            label: 'Game State',
            icon: Activity,
            content: (
              <>
                <DevToolbarSection title="Stats">
                  <DevToolbarInfo label="Score" value={gameState.score} />
                  <DevToolbarInfo label="Moves" value={gameState.moves} />
                  <DevToolbarInfo label="Best" value={gameState.bestScore} />
                </DevToolbarSection>
                
                <DevToolbarSection title="Actions">
                  <DevToolbarButton onClick={() => resetGame()}>
                    Reset Game
                  </DevToolbarButton>
                  <DevToolbarButton 
                    onClick={() => setDebugMode(!debugMode)}
                    variant={debugMode ? 'danger' : 'default'}
                  >
                    {debugMode ? 'Disable' : 'Enable'} Debug
                  </DevToolbarButton>
                </DevToolbarSection>
              </>
            )
          }
        ]}
      />
    </>
  )
}
```

That's it! The toolbar will appear as a bug icon in the bottom-right corner of your app.

## Quick Links

- [Getting Started](./getting-started.md) - More setup options
- [API Reference](./api-reference.md) - All props and components
- [Configuration](./configuration.md) - Positioning and themes
- [Environment Control](./environment-control.md) - Managing visibility
- [Examples](./examples.md) - Common patterns
- [Advanced](./advanced.md) - Pane mode, keyboard shortcuts
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## Key Features

### 5 Positioning Modes
```jsx
<DevToolbar position="bottom-right" />  // Default
<DevToolbar position="bottom-left" />
<DevToolbar position="top-right" />
<DevToolbar position="top-left" />
<DevToolbar position="pane" />  // Chrome DevTools-style
```

### Built-in Components
```jsx
import { 
  DevToolbar,
  DevToolbarSection,
  DevToolbarButton,
  DevToolbarInfo,
  DevToolbarToggle 
} from '@arach/devbar'

// Use in your tabs
<DevToolbarSection title="Settings">
  <DevToolbarInfo label="Version" value="1.0.0" />
  <DevToolbarToggle 
    label="Debug Mode"
    checked={debug}
    onChange={setDebug}
  />
  <DevToolbarButton onClick={refresh}>
    Refresh
  </DevToolbarButton>
</DevToolbarSection>
```

### Theme Support
```jsx
<DevToolbar theme="dark" />   // Force dark
<DevToolbar theme="light" />  // Force light
<DevToolbar theme="auto" />   // Match system
```

### Production Safe
```jsx
// Automatically hidden in production
<DevToolbar />

// Or explicitly control
<DevToolbar hideInProduction={false} />
```

## Common Use Cases

### State Inspector
```jsx
<DevToolbar 
  tabs={[
    {
      id: 'state',
      label: 'State',
      icon: Database,
      content: (
        <pre className="text-xs">
          {JSON.stringify(state, null, 2)}
        </pre>
      )
    }
  ]}
/>
```

### Performance Monitor
```jsx
<DevToolbar 
  tabs={[
    {
      id: 'perf',
      label: 'Performance',
      icon: Activity,
      content: (
        <DevToolbarSection title="Metrics">
          <DevToolbarInfo label="FPS" value={fps} />
          <DevToolbarInfo label="Memory" value={memory} />
          <DevToolbarInfo label="Renders" value={renders} />
        </DevToolbarSection>
      )
    }
  ]}
/>
```

### Feature Flags
```jsx
<DevToolbar 
  tabs={[
    {
      id: 'flags',
      label: 'Features',
      icon: Flag,
      content: (
        <DevToolbarSection title="Feature Flags">
          {flags.map(flag => (
            <DevToolbarToggle
              key={flag.id}
              label={flag.name}
              checked={flag.enabled}
              onChange={(v) => updateFlag(flag.id, v)}
            />
          ))}
        </DevToolbarSection>
      )
    }
  ]}
/>
```

## Why @arach/devbar?

- **Non-intrusive**: Starts as a small bug icon, expands on click
- **Beautiful**: Modern glassmorphic design with smooth animations
- **Lightweight**: ~10KB gzipped, minimal dependencies
- **TypeScript**: Full type safety and IntelliSense
- **Flexible**: 5 positioning modes including Chrome DevTools-style pane
- **Production-safe**: Auto-hides in production builds

## License

MIT © [arach](https://github.com/arach)