# Configuration

Detailed guide for configuring @arach/devbar's appearance, positioning, and behavior.

## Positioning

The toolbar supports five different positioning modes to fit your development workflow.

### Corner Positions

Four corner positions are available for floating toolbar placement:

```tsx
// Bottom right (default)
<DevToolbar tabs={tabs} position="bottom-right" />

// Bottom left
<DevToolbar tabs={tabs} position="bottom-left" />

// Top right
<DevToolbar tabs={tabs} position="top-right" />

// Top left
<DevToolbar tabs={tabs} position="top-left" />
```

**Characteristics of corner positions:**
- Fixed positioning with 24px offset from edges
- Rounded corners (16px radius)
- Shadow effects for depth
- Expand/collapse button in header
- Configurable width and max height

### Pane Mode

Chrome DevTools-style bottom pane that spans the full width:

```tsx
<DevToolbar 
  tabs={tabs} 
  position="pane"
  defaultPaneHeight="350px"
/>
```

**Pane mode features:**
- Full width bottom panel
- Resizable height via drag handle
- ESC key to close
- Smooth slide-in/out animation
- No expand button (always full width)

## Themes

### Built-in Themes

Three theme options are available:

```tsx
// Dark theme (dark background, light text)
<DevToolbar tabs={tabs} theme="dark" />

// Light theme (light background, dark text)
<DevToolbar tabs={tabs} theme="light" />

// Auto theme (follows system preference)
<DevToolbar tabs={tabs} theme="auto" />
```

### Theme Colors

| Element | Dark Theme | Light Theme |
|---------|------------|-------------|
| Background | `#111827` | `#ffffff` |
| Text | `#e5e7eb` | `#374151` |
| Muted Text | `#9ca3af` | `#6b7280` |
| Border | `rgba(55, 65, 81, 0.5)` | `#e5e7eb` |
| Button Background | `#0a0a0a` | `#ffffff` |
| Active Tab | `#1f2937` | `#f9fafb` |
| Tab Indicator | `#60a5fa` | `#3b82f6` |

### Applying Theme to Utility Components

Pass the theme prop to utility components for consistent styling:

```tsx
<DevToolbarSection title="Settings" theme="dark">
  <DevToolbarInfo label="Mode" value="Debug" theme="dark" />
  <DevToolbarToggle 
    label="Enable feature" 
    checked={enabled}
    onChange={setEnabled}
    theme="dark"
  />
</DevToolbarSection>
```

## Dimensions

### Panel Size

Control the toolbar panel dimensions:

```tsx
<DevToolbar
  tabs={tabs}
  width="400px"        // Width in corner positions
  maxHeight="500px"    // Max height in corner positions
  defaultPaneHeight="320px"  // Initial height in pane mode
/>
```

### Responsive Sizing

The toolbar adapts to different screen sizes:
- Corner modes: Fixed width, scrollable content
- Pane mode: Full width, resizable height
- Expanded mode: 80% width (max 1200px), 70vh height (max 800px)

## Title and Icons

### Custom Title

Change the toolbar title displayed in the header:

```tsx
<DevToolbar 
  tabs={tabs}
  title="Debug Panel"  // Default is "Dev"
/>
```

### Custom Toggle Icon

Replace the default bug icon with custom content:

```tsx
// Using emoji
<DevToolbar 
  tabs={tabs}
  customIcon={<span>🚀</span>}
/>

// Using custom SVG
<DevToolbar 
  tabs={tabs}
  customIcon={
    <svg width="16" height="16" viewBox="0 0 16 16">
      {/* Your SVG content */}
    </svg>
  }
/>

// Using another Lucide icon
import { Wrench } from 'lucide-react';

<DevToolbar 
  tabs={tabs}
  customIcon={<Wrench size={16} />}
/>
```

## Initial State

### Start Open

Have the toolbar expanded when the page loads:

```tsx
<DevToolbar 
  tabs={tabs}
  defaultOpen={true}
/>
```

### Default Tab

Specify which tab should be active initially:

```tsx
<DevToolbar 
  tabs={tabs}
  defaultTab="metrics"  // Must match a tab's id
/>
```

## Production Behavior

### Auto-Hide in Production

By default, the toolbar only appears in development:

```tsx
// Hidden in production (default)
<DevToolbar tabs={tabs} />

// Always visible (not recommended for production)
<DevToolbar tabs={tabs} hideInProduction={false} />
```

For more control over environment-based visibility, see [Environment Control](./environment-control.md).

### Environment Detection

The toolbar checks `process.env.NODE_ENV`:
- `development`: Toolbar is visible
- `production`: Toolbar is hidden (unless `hideInProduction={false}`)

## Advanced Configuration

### Dynamic Configuration

Change configuration based on user preferences or app state:

```tsx
function App() {
  const [userPrefs, setUserPrefs] = useState({
    position: 'bottom-right',
    theme: 'dark',
    panelWidth: '320px'
  });

  return (
    <DevToolbar
      tabs={tabs}
      position={userPrefs.position}
      theme={userPrefs.theme}
      width={userPrefs.panelWidth}
    />
  );
}
```

### Per-Environment Configuration

Different settings for different environments:

```tsx
const isDev = process.env.NODE_ENV === 'development';
const isStaging = process.env.REACT_APP_ENV === 'staging';

<DevToolbar
  tabs={tabs}
  hideInProduction={!isStaging}  // Show in staging
  defaultOpen={isDev}  // Auto-open in dev
  position={isDev ? 'pane' : 'bottom-right'}
  theme={isDev ? 'dark' : 'light'}
/>
```

### Feature Flags

Use feature flags to control toolbar behavior:

```tsx
const features = useFeatureFlags();

<DevToolbar
  tabs={tabs}
  position={features.devToolsPaneMode ? 'pane' : 'bottom-right'}
  defaultOpen={features.devToolsAutoOpen}
  theme={features.darkMode ? 'dark' : 'light'}
/>
```

## CSS Customization

### Using className

Apply custom styles via className:

```tsx
<DevToolbar 
  tabs={tabs}
  className="my-custom-toolbar"
/>
```

```css
.my-custom-toolbar {
  /* Your custom styles */
  font-size: 14px;
}

.my-custom-toolbar button:first-child {
  /* Style the toggle button */
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.my-custom-toolbar > div:last-child {
  /* Style the panel */
  backdrop-filter: blur(20px);
}
```

### Overriding Inline Styles

Since the toolbar uses inline styles for reliability, use `!important` sparingly:

```css
.my-custom-toolbar > div:last-child {
  background-color: rgba(0, 0, 0, 0.95) !important;
  border: 2px solid gold !important;
}
```

## Typography Configuration

The toolbar uses Inconsolata font with system font fallbacks:

```css
/* Default font stack */
font-family: "Inconsolata", "SF Mono", "Monaco", "Fira Code", "Geist Mono", monospace;
```

To use a different font, override with CSS:

```css
.my-custom-toolbar {
  font-family: "Your Font", monospace !important;
}
```

## Performance Options

### Lazy Loading Content

Load tab content only when needed:

```tsx
const tabs = [
  {
    id: 'heavy',
    label: 'Heavy Content',
    icon: Database,
    content: () => {
      // This component is only rendered when tab is active
      return <HeavyComponent />;
    }
  }
];
```

### Memoized Content

Prevent unnecessary re-renders:

```tsx
const MemoizedContent = React.memo(({ data }) => {
  return <ExpensiveVisualization data={data} />;
});

const tabs = [
  {
    id: 'viz',
    label: 'Visualization',
    icon: BarChart,
    content: <MemoizedContent data={data} />
  }
];
```

## Accessibility

### ARIA Labels

The toolbar includes built-in ARIA labels:
- Toggle button: "Show/Hide dev toolbar"
- Close button: "Close toolbar"
- Expand button: "Expand/Collapse toolbar"

### Keyboard Navigation

- **ESC key**: Closes toolbar in pane mode
- **Tab key**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and toggles

### Screen Reader Support

All interactive elements have appropriate roles and labels for screen reader compatibility.

## Best Practices

1. **Position Selection**
   - Use corner positions for minimal intrusion
   - Use pane mode for complex debugging tasks
   - Consider user's primary work area

2. **Theme Consistency**
   - Match your app's theme for visual consistency
   - Use auto theme to respect user preferences
   - Pass theme to all utility components

3. **Performance**
   - Keep default size reasonable (320px width is optimal)
   - Use lazy loading for heavy content
   - Limit the number of tabs to 5-7 for best UX

4. **Production**
   - Always use `hideInProduction={true}` (default)
   - Remove sensitive data from toolbar content
   - Consider environment-specific configurations