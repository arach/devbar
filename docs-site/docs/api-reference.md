# API Reference

Complete reference for all components, hooks, and types exported by @arach/devbar.

## Components

### DevToolbar

The main toolbar component that renders a collapsible panel with tabs.

```tsx
import { DevToolbar } from '@arach/devbar';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `DevToolbarTab[]` | *required* | Array of tab configurations |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' \| 'pane'` | `'bottom-right'` | Position of the toolbar |
| `theme` | `'dark' \| 'light' \| 'auto'` | `'auto'` | Color theme |
| `defaultTab` | `string` | First tab | ID of the initially active tab |
| `title` | `string` | `'Dev'` | Title shown in the toolbar header |
| `hideInProduction` | `boolean` | `true` | Auto-hide in production builds |
| `defaultOpen` | `boolean` | `false` | Start with toolbar expanded |
| `customIcon` | `ReactNode` | Bug icon | Custom icon for the toggle button |
| `width` | `string` | `'320px'` | Width of the panel (non-pane modes) |
| `maxHeight` | `string` | `'400px'` | Maximum height (non-pane modes) |
| `defaultPaneHeight` | `string` | `'300px'` | Initial height in pane mode |
| `className` | `string` | `''` | Additional CSS classes |

#### Example

```tsx
<DevToolbar
  tabs={tabs}
  position="bottom-left"
  theme="dark"
  title="Debug Tools"
  defaultTab="metrics"
  hideInProduction={false}
  defaultOpen={true}
  width="400px"
  maxHeight="500px"
/>
```

### DevToolbarSection

A section container with optional title for organizing content within tabs.

```tsx
import { DevToolbarSection } from '@arach/devbar';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Optional section title |
| `children` | `ReactNode` | *required* | Section content |
| `theme` | `'light' \| 'dark'` | `'dark'` | Color theme for text |
| `className` | `string` | `''` | Additional CSS classes |

#### Example

```tsx
<DevToolbarSection title="Performance Metrics" theme="dark">
  <div>FPS: 60</div>
  <div>Memory: 42MB</div>
</DevToolbarSection>
```

### DevToolbarButton

A styled button component with multiple variants.

```tsx
import { DevToolbarButton } from '@arach/devbar';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | *required* | Click handler |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Button style variant |
| `size` | `'xs' \| 'sm'` | `'xs'` | Button size |
| `children` | `ReactNode` | *required* | Button content |
| `className` | `string` | `''` | Additional CSS classes |

#### Variants

- `default` - Purple gradient
- `primary` - Blue gradient
- `success` - Green gradient
- `warning` - Pink gradient
- `danger` - Red gradient

#### Example

```tsx
<DevToolbarButton 
  onClick={() => console.log('Clicked!')}
  variant="success"
  size="sm"
>
  Save Changes
</DevToolbarButton>
```

### DevToolbarInfo

A key-value display component for showing information.

```tsx
import { DevToolbarInfo } from '@arach/devbar';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | *required* | Label text |
| `value` | `string \| number \| boolean` | *required* | Value to display |
| `theme` | `'light' \| 'dark'` | `'dark'` | Color theme |
| `className` | `string` | `''` | Additional CSS classes |

#### Example

```tsx
<DevToolbarInfo label="Version" value="1.2.3" />
<DevToolbarInfo label="Environment" value="development" />
<DevToolbarInfo label="Debug Mode" value={true} />
```

### DevToolbarToggle

A toggle switch component for boolean settings.

```tsx
import { DevToolbarToggle } from '@arach/devbar';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | *required* | Current state |
| `onChange` | `(checked: boolean) => void` | *required* | Change handler |
| `label` | `string` | - | Optional label text |
| `theme` | `'light' \| 'dark'` | `'dark'` | Color theme |
| `className` | `string` | `''` | Additional CSS classes |

#### Example

```tsx
const [darkMode, setDarkMode] = useState(false);

<DevToolbarToggle
  label="Dark Mode"
  checked={darkMode}
  onChange={setDarkMode}
/>
```

## Hooks

### useDevToolbarTab

A utility hook for creating tab configurations.

```tsx
import { useDevToolbarTab } from '@arach/devbar';
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique tab identifier |
| `label` | `string` | Tab label text |
| `icon` | `LucideIcon` | Icon component from lucide-react |
| `content` | `ReactNode \| (() => ReactNode)` | Tab content or content function |

#### Returns

Returns a `DevToolbarTab` object.

#### Example

```tsx
import { useDevToolbarTab } from '@arach/devbar';
import { Settings } from 'lucide-react';

function MyComponent() {
  const settingsTab = useDevToolbarTab(
    'settings',
    'Settings',
    Settings,
    <SettingsPanel />
  );
  
  const tabs = [settingsTab];
  
  return <DevToolbar tabs={tabs} />;
}
```

## Types

### DevToolbarTab

The tab configuration interface.

```tsx
interface DevToolbarTab {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode | (() => ReactNode);
}
```

### DevToolbarProps

The main toolbar component props interface.

```tsx
interface DevToolbarProps {
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
  defaultPaneHeight?: string;
  defaultOpen?: boolean;
}
```

## Styling

### CSS Variables

The toolbar uses inline styles for reliability, but you can override styles using CSS classes:

```css
/* Target the main button */
.your-custom-class button:first-child {
  /* Custom button styles */
}

/* Target the panel */
.your-custom-class > div:last-child {
  /* Custom panel styles */
}
```

### Typography

The toolbar uses the Inconsolata font family with fallbacks:

```css
font-family: "Inconsolata", "SF Mono", "Monaco", "Fira Code", "Geist Mono", monospace;
```

### Z-Index Layers

- Toggle button: `z-index: 9999`
- Panel: `z-index: 9998`

## Advanced Usage

### Dynamic Tab Content

Use a function to generate fresh content on each render:

```tsx
const tabs = [
  {
    id: 'dynamic',
    label: 'Live Data',
    icon: Activity,
    content: () => {
      // This function is called on every render
      const timestamp = new Date().toISOString();
      return <div>Last update: {timestamp}</div>;
    }
  }
];
```

### Conditional Tabs

Build tabs array conditionally based on features or permissions:

```tsx
const tabs = [
  {
    id: 'basic',
    label: 'Basic',
    icon: Info,
    content: <BasicPanel />
  },
  ...(hasAdvancedFeatures ? [{
    id: 'advanced',
    label: 'Advanced',
    icon: Settings,
    content: <AdvancedPanel />
  }] : []),
  ...(isAdmin ? [{
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    content: <AdminPanel />
  }] : [])
];
```

### Controlled State

Control the toolbar's open/closed state externally:

```tsx
function App() {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  
  // Control toolbar from elsewhere in your app
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        setIsToolbarOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  return (
    <DevToolbar 
      tabs={tabs}
      defaultOpen={isToolbarOpen}
      key={isToolbarOpen ? 'open' : 'closed'} // Force remount
    />
  );
}
```

## Browser APIs

The toolbar is compatible with all modern browsers and uses standard React patterns. No special polyfills are required.

### Performance Considerations

- The toolbar uses React's built-in optimization features
- Content functions are called on every render, so keep them lightweight
- Use React.memo() for expensive content components
- The toolbar automatically removes itself from DOM when hidden in production