# @arach/devbar Documentation

A beautiful, minimal development toolbar for React applications with Chrome DevTools-style pane mode.

[![npm version](https://img.shields.io/npm/v/@arach/devbar.svg)](https://www.npmjs.com/package/@arach/devbar)
[![React](https://img.shields.io/badge/React-%3E%3D16.8.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Quick Links

- [Getting Started](./getting-started.md) - Installation and basic setup
- [API Reference](./api-reference.md) - Complete component and hook documentation
- [Configuration](./configuration.md) - Positioning, themes, and customization options
- [Environment Control](./environment-control.md) - Managing visibility across environments
- [Examples](./examples.md) - Common use cases and recipes
- [Advanced Features](./advanced.md) - Pane mode, keyboard shortcuts, and more
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## Features

### Core Features
- **5 positioning modes** - Corner positions plus Chrome DevTools-style pane mode
- **Tabbed interface** - Organize debugging tools into logical sections
- **Light/Dark themes** - Seamless theme support with auto detection
- **Production-ready** - Auto-hides in production by default
- **Zero dependencies** - Only requires React and lucide-react for icons

### Advanced Features
- **Pane mode** - Full-width bottom panel like Chrome DevTools
- **Resizable panels** - Drag to resize in pane mode
- **Keyboard shortcuts** - ESC to close in pane mode
- **Expandable view** - Maximize corner panels for more content
- **Dynamic content** - Support for function render props
- **Custom styling** - Fully customizable with inline styles

## Why @arach/devbar?

### Minimal & Beautiful
Designed with a focus on aesthetics and usability. The toolbar features smooth animations, thoughtful typography using Inconsolata font, and a clean interface that doesn't distract from your application.

### Developer Experience
Built by developers for developers. Every interaction is optimized for quick debugging and monitoring during development, with features like:
- Quick position switching
- Persistent state across page reloads
- Smart auto-hide in production
- Responsive and accessible design

### Easy Integration
```jsx
import { DevToolbar } from '@arach/devbar'
import { Info } from 'lucide-react'

function App() {
  const tabs = [
    {
      id: 'info',
      label: 'Info',
      icon: Info,
      content: <div>Debug information here</div>
    }
  ]

  return (
    <>
      <YourApp />
      <DevToolbar tabs={tabs} />
    </>
  )
}
```

## License

MIT © arach

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/arach/devbar).