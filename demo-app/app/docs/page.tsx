'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Book, Rocket, Code, Settings, Lightbulb, Zap, ArrowLeft, Menu, X } from 'lucide-react'

// Documentation content
const docs = {
  'getting-started': {
    title: 'Getting Started',
    icon: Rocket,
    content: `
# Getting Started

Get up and running with @arach/devbar in under 5 minutes.

## Installation

Install the package using your preferred package manager:

\`\`\`bash
# npm
npm install @arach/devbar

# pnpm
pnpm add @arach/devbar

# yarn
yarn add @arach/devbar
\`\`\`

## Basic Usage

### 1. Import the DevToolbar

\`\`\`jsx
import { DevToolbar } from '@arach/devbar'
import { Info, Activity, Settings } from 'lucide-react'
\`\`\`

### 2. Define Your Tabs

\`\`\`jsx
const tabs = [
  {
    id: 'info',
    label: 'Info',
    icon: Info,
    content: (
      <div>
        <h3>Application Info</h3>
        <p>Version: 1.0.0</p>
      </div>
    )
  }
]
\`\`\`

### 3. Add to Your App

\`\`\`jsx
function App() {
  return (
    <>
      <YourApplication />
      <DevToolbar 
        tabs={tabs}
        position="bottom-right"
        theme="auto"
      />
    </>
  )
}
\`\`\`
    `
  },
  'api-reference': {
    title: 'API Reference',
    icon: Code,
    content: `
# API Reference

## Components

### DevToolbar

The main toolbar component.

\`\`\`typescript
interface DevToolbarProps {
  tabs: DevToolbarTab[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'pane'
  theme?: 'dark' | 'light' | 'auto'
  hideInProduction?: boolean
  title?: string
  width?: string
  maxHeight?: string
  defaultPaneHeight?: string
  defaultOpen?: boolean
}
\`\`\`

### DevToolbarSection

Container for organizing content within tabs.

\`\`\`jsx
<DevToolbarSection title="Section Title">
  {/* Your content */}
</DevToolbarSection>
\`\`\`

### DevToolbarButton

Styled button with gradient variants.

\`\`\`jsx
<DevToolbarButton 
  onClick={() => console.log('clicked')}
  variant="success"
>
  Click Me
</DevToolbarButton>
\`\`\`

### DevToolbarInfo

Display key-value pairs.

\`\`\`jsx
<DevToolbarInfo label="Version" value="1.0.0" />
\`\`\`

### DevToolbarToggle

Toggle switch for boolean settings.

\`\`\`jsx
<DevToolbarToggle
  checked={enabled}
  onChange={setEnabled}
  label="Enable Feature"
/>
\`\`\`

## Hooks

### useDevToolbarTab

Utility hook for creating tabs.

\`\`\`jsx
const tab = useDevToolbarTab(
  'id',
  'Label',
  IconComponent,
  <TabContent />
)
\`\`\`
    `
  },
  'configuration': {
    title: 'Configuration',
    icon: Settings,
    content: `
# Configuration

## Positioning

The toolbar supports 5 positioning modes:

### Corner Positions
- \`bottom-right\` (default)
- \`bottom-left\`
- \`top-right\`
- \`top-left\`

### Pane Mode
Chrome DevTools-style bottom panel:

\`\`\`jsx
<DevToolbar 
  position="pane"
  defaultPaneHeight="350px"
/>
\`\`\`

## Themes

### Theme Options

\`\`\`jsx
// Dark theme
<DevToolbar theme="dark" />

// Light theme
<DevToolbar theme="light" />

// Auto (follows system)
<DevToolbar theme="auto" />
\`\`\`

## Dimensions

### Corner Positions

\`\`\`jsx
<DevToolbar
  width="400px"
  maxHeight="500px"
/>
\`\`\`

### Pane Mode

\`\`\`jsx
<DevToolbar
  position="pane"
  defaultPaneHeight="300px"
/>
\`\`\`

## Production Behavior

\`\`\`jsx
// Always visible
<DevToolbar hideInProduction={false} />

// Hidden in production (default)
<DevToolbar hideInProduction={true} />
\`\`\`
    `
  },
  'examples': {
    title: 'Examples',
    icon: Lightbulb,
    content: `
# Examples

## Simple Debug Panel

\`\`\`jsx
import { DevToolbar, DevToolbarSection, DevToolbarInfo } from '@arach/devbar'
import { Info } from 'lucide-react'

function App() {
  const tabs = [
    {
      id: 'debug',
      label: 'Debug',
      icon: Info,
      content: (
        <DevToolbarSection title="Debug Info">
          <DevToolbarInfo label="Version" value="1.0.0" />
          <DevToolbarInfo label="Build" value="Production" />
        </DevToolbarSection>
      )
    }
  ]

  return <DevToolbar tabs={tabs} />
}
\`\`\`

## Performance Monitor

\`\`\`jsx
function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        fps: Math.round(60 + Math.random() * 5),
        memory: Math.round(performance.memory?.usedJSHeapSize / 1048576)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      content: (
        <DevToolbarSection title="Metrics">
          <DevToolbarInfo label="FPS" value={metrics.fps} />
          <DevToolbarInfo label="Memory (MB)" value={metrics.memory} />
        </DevToolbarSection>
      )
    }
  ]

  return <DevToolbar tabs={tabs} />
}
\`\`\`

## Feature Flags

\`\`\`jsx
function FeatureFlags() {
  const [flags, setFlags] = useState({
    darkMode: true,
    betaFeatures: false
  })

  const tabs = [
    {
      id: 'features',
      label: 'Features',
      icon: ToggleLeft,
      content: (
        <DevToolbarSection title="Feature Flags">
          {Object.entries(flags).map(([key, value]) => (
            <DevToolbarToggle
              key={key}
              checked={value}
              onChange={(checked) => 
                setFlags(prev => ({ ...prev, [key]: checked }))
              }
              label={key}
            />
          ))}
        </DevToolbarSection>
      )
    }
  ]

  return <DevToolbar tabs={tabs} />
}
\`\`\`
    `
  },
  'advanced': {
    title: 'Advanced Features',
    icon: Zap,
    content: `
# Advanced Features

## Pane Mode

Chrome DevTools-style bottom panel with resizing:

\`\`\`jsx
<DevToolbar 
  position="pane"
  defaultPaneHeight="350px"
  defaultOpen={true}
/>
\`\`\`

### Features
- Drag to resize
- ESC to close
- Full-width layout
- Smooth animations

## Dynamic Content

Use functions for content that updates:

\`\`\`jsx
const tabs = [
  {
    id: 'dynamic',
    label: 'Live',
    icon: Activity,
    content: () => {
      // Re-evaluated on each render
      const time = new Date().toLocaleTimeString()
      return <div>Time: {time}</div>
    }
  }
]
\`\`\`

## Performance Optimization

### Memoization

\`\`\`jsx
const tabs = useMemo(() => [
  {
    id: 'heavy',
    label: 'Heavy',
    icon: Database,
    content: <HeavyComponent />
  }
], [dependencies])
\`\`\`

### Lazy Loading

\`\`\`jsx
const tabs = [
  {
    id: 'lazy',
    label: 'Lazy',
    icon: Clock,
    content: () => {
      const [loaded, setLoaded] = useState(false)
      
      useEffect(() => {
        // Load on demand
        import('./HeavyModule').then(() => {
          setLoaded(true)
        })
      }, [])
      
      return loaded ? <HeavyContent /> : <Loading />
    }
  }
]
\`\`\`

## State Persistence

\`\`\`jsx
function PersistentToolbar() {
  const [position, setPosition] = useState(() => 
    localStorage.getItem('devbar-position') || 'bottom-right'
  )
  
  useEffect(() => {
    localStorage.setItem('devbar-position', position)
  }, [position])
  
  return <DevToolbar position={position} tabs={tabs} />
}
\`\`\`

## Keyboard Shortcuts

| Key | Action | Mode |
|-----|--------|------|
| ESC | Close toolbar | Pane mode only |

## Accessibility

- Full keyboard navigation
- ARIA labels
- Screen reader support
- Focus management
    `
  }
}

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState('getting-started')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderMarkdown = (content: string) => {
    // Simple markdown parser for demo
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-3xl font-bold mb-6 mt-8">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-semibold mb-4 mt-6">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-medium mb-3 mt-4">{line.slice(4)}</h3>
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          const lang = line.slice(3)
          const endIndex = content.indexOf('```', content.indexOf(line) + line.length)
          const code = content.substring(content.indexOf(line) + line.length, endIndex).trim()
          return (
            <pre key={i} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
              <code>{code}</code>
            </pre>
          )
        }
        
        // Inline code
        if (line.includes('`')) {
          const parts = line.split('`')
          return (
            <p key={i} className="mb-2">
              {parts.map((part, j) => 
                j % 2 === 0 ? part : <code key={j} className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{part}</code>
              )}
            </p>
          )
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 mb-1">• {line.slice(2)}</li>
        }
        
        // Tables
        if (line.includes('|') && line.includes('-')) {
          return null // Skip table separators
        }
        if (line.includes('|')) {
          const cells = line.split('|').filter(c => c.trim())
          return (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td key={j} className="border border-gray-300 dark:border-gray-700 px-3 py-1">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          )
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={i} className="mb-2 text-gray-700 dark:text-gray-300">{line}</p>
        }
        
        return null
      })
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Back to Demo</span>
              </Link>
              <div className="ml-8 flex items-center space-x-3">
                <Book className="w-6 h-6 text-blue-500" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  @arach/devbar Documentation
                </h1>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
            <nav className="sticky top-24">
              <ul className="space-y-1">
                {Object.entries(docs).map(([key, doc]) => {
                  const Icon = doc.icon
                  return (
                    <li key={key}>
                      <button
                        onClick={() => {
                          setActiveDoc(key)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                          activeDoc === key
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{doc.title}</span>
                        {activeDoc === key && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
              
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.npmjs.com/package/@arach/devbar" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 dark:text-blue-400 hover:underline">
                      NPM Package →
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/arach/devbar" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 dark:text-blue-400 hover:underline">
                      GitHub Repo →
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {renderMarkdown(docs[activeDoc as keyof typeof docs].content)}
            </div>
            
            {/* Navigation footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between">
                {Object.entries(docs).map(([key], index, arr) => {
                  if (index > 0 && arr[index - 1][0] === activeDoc) {
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveDoc(key)}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>← {docs[key as keyof typeof docs].title}</span>
                      </button>
                    )
                  }
                  if (index < arr.length - 1 && arr[index + 1][0] === activeDoc) {
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveDoc(key)}
                        className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline ml-auto"
                      >
                        <span>{docs[key as keyof typeof docs].title} →</span>
                      </button>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}