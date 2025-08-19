# Getting Started

Get up and running with @arach/devbar in less than 5 minutes.

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm install @arach/devbar

# pnpm (recommended)
pnpm add @arach/devbar

# yarn
yarn add @arach/devbar
```

## Quick Start

### 1. Basic Setup

Add the DevToolbar to your React application with minimal configuration:

```tsx
import { DevToolbar } from '@arach/devbar';
import { Bug, Settings } from 'lucide-react';

function App() {
  const tabs = [
    {
      id: 'debug',
      label: 'Debug',
      icon: Bug,
      content: <div>Debug information here</div>
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: <div>App settings here</div>
    }
  ];

  return (
    <div>
      {/* Your application */}
      <h1>My App</h1>
      
      {/* Add DevToolbar */}
      <DevToolbar tabs={tabs} />
    </div>
  );
}
```

That's it! The toolbar will appear in the bottom-right corner with a bug icon. Click it to expand.

### 2. TypeScript Setup

@arach/devbar includes TypeScript definitions. Here's a fully typed example:

```tsx
import { DevToolbar, DevToolbarTab } from '@arach/devbar';
import { Settings, Activity, Database } from 'lucide-react';

function App() {
  const tabs: DevToolbarTab[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: <SettingsPanel />
    },
    {
      id: 'metrics',
      label: 'Metrics',
      icon: Activity,
      content: <MetricsPanel />
    },
    {
      id: 'data',
      label: 'Data',
      icon: Database,
      content: <DataPanel />
    }
  ];

  return (
    <>
      <YourApp />
      <DevToolbar 
        tabs={tabs}
        position="bottom-right"
        theme="dark"
        title="Dev Tools"
      />
    </>
  );
}
```

### 3. Next.js Integration

For Next.js applications, wrap the toolbar in a client component:

```tsx
// components/DevToolbarWrapper.tsx
'use client';

import { DevToolbar } from '@arach/devbar';
import { Settings, Activity } from 'lucide-react';

export default function DevToolbarWrapper() {
  const tabs = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: <div>Settings panel</div>
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      content: <div>Performance metrics</div>
    }
  ];

  return <DevToolbar tabs={tabs} hideInProduction={false} />;
}
```

Then use it in your layout:

```tsx
// app/layout.tsx
import DevToolbarWrapper from '@/components/DevToolbarWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <DevToolbarWrapper />
      </body>
    </html>
  );
}
```

### 4. Dynamic Content

Use function render props for dynamic content that updates:

```tsx
import { DevToolbar } from '@arach/devbar';
import { Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [metrics, setMetrics] = useState({ fps: 60, memory: 0 });
  
  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      setMetrics({
        fps: Math.round(50 + Math.random() * 10),
        memory: performance.memory?.usedJSHeapSize || 0
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      id: 'metrics',
      label: 'Metrics',
      icon: Activity,
      // Function that returns fresh content on each render
      content: () => (
        <div>
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {(metrics.memory / 1024 / 1024).toFixed(2)} MB</div>
          <div>Time: {new Date().toLocaleTimeString()}</div>
        </div>
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

### 5. Using Utility Components

@arach/devbar provides utility components for consistent styling:

```tsx
import { 
  DevToolbar, 
  DevToolbarSection, 
  DevToolbarButton,
  DevToolbarInfo,
  DevToolbarToggle 
} from '@arach/devbar';
import { Settings } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  const tabs = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: (
        <>
          <DevToolbarSection title="Display">
            <DevToolbarToggle
              label="Dark Mode"
              checked={darkMode}
              onChange={setDarkMode}
            />
            <DevToolbarToggle
              label="Debug Mode"
              checked={debugMode}
              onChange={setDebugMode}
            />
          </DevToolbarSection>
          
          <DevToolbarSection title="Info">
            <DevToolbarInfo label="Version" value="1.0.0" />
            <DevToolbarInfo label="Environment" value="development" />
          </DevToolbarSection>
          
          <DevToolbarSection title="Actions">
            <DevToolbarButton 
              onClick={() => console.log('Cleared!')}
              variant="danger"
            >
              Clear Cache
            </DevToolbarButton>
          </DevToolbarSection>
        </>
      )
    }
  ];

  return (
    <>
      <YourApp />
      <DevToolbar tabs={tabs} theme={darkMode ? 'dark' : 'light'} />
    </>
  );
}
```

## Production Behavior

By default, DevToolbar automatically hides in production builds:

```tsx
// This will only show in development
<DevToolbar tabs={tabs} />

// Force show in production (not recommended)
<DevToolbar tabs={tabs} hideInProduction={false} />
```

The toolbar detects production by checking `process.env.NODE_ENV === 'production'`.

## Common Patterns

### Single Tab (No Tab Bar)

When you only need one panel, pass a single tab and the tab bar will be hidden:

```tsx
const tabs = [
  {
    id: 'main',
    label: 'Debug',
    icon: Bug,
    content: <DebugPanel />
  }
];

<DevToolbar tabs={tabs} />
```

### Custom Icon

Replace the default bug icon with your own:

```tsx
<DevToolbar 
  tabs={tabs}
  customIcon={<span>🚀</span>}
/>
```

### Start Open

Have the toolbar open by default:

```tsx
<DevToolbar 
  tabs={tabs}
  defaultOpen={true}
/>
```

### Default Tab Selection

Specify which tab should be active initially:

```tsx
<DevToolbar 
  tabs={tabs}
  defaultTab="settings"  // Must match a tab.id
/>
```

## Troubleshooting

### Toolbar not appearing

1. **Check hideInProduction**: In production builds, set `hideInProduction={false}`
2. **Check z-index conflicts**: The toolbar uses `z-index: 9999`. Ensure no other elements overlap
3. **Check console errors**: Look for any React errors that might prevent rendering

### SSR/Hydration warnings

If you see hydration warnings in Next.js or other SSR frameworks:

1. Wrap DevToolbar in a client component with `'use client'` directive
2. Use dynamic imports with `ssr: false`:

```tsx
import dynamic from 'next/dynamic';

const DevToolbar = dynamic(
  () => import('@arach/devbar').then(mod => mod.DevToolbar),
  { ssr: false }
);
```

### TypeScript errors

Ensure you have the proper TypeScript setup:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Next Steps

- Explore [API Reference](#api-reference) for all available props and options
- Check out [Examples](#examples) for common use cases
- Learn about [Advanced Features](#advanced) like pane mode and keyboard shortcuts