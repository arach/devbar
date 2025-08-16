# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React component library providing a beautiful, minimal development toolbar for debugging and monitoring React applications. Published as `@arach/devbar` npm package.

## Build Commands

```bash
# Development (watches for changes)
pnpm dev

# Production build
pnpm build

# Linting
pnpm lint

# Build before publishing
pnpm prepublishOnly
```

## Architecture

### Core Component
- **Main export**: `DevToolbar` component from `src/index.tsx`
- **Build system**: Uses `tsup` for bundling (outputs CJS, ESM, and TypeScript declarations)
- **Dependencies**: Only `lucide-react` for icons, React as peer dependency

### Component API
The library exports:
- `DevToolbar` - Main toolbar component with collapsible panel
- `useDevToolbarTab` - Hook for creating toolbar tabs
- `DevToolbarSection` - Utility component for consistent section styling
- `DevToolbarButton` - Pre-styled button component with variants
- `DevToolbarInfo` - Component for displaying key-value information

### Key Features
- Auto-hides in production unless `hideInProduction={false}`
- Supports dynamic content via function render props
- Configurable positioning (4 corners)
- Theme support (dark/light/auto)
- Customizable icons and dimensions

## Development Notes

- TypeScript strict mode is enabled
- React 16.8+ required (uses hooks)
- Bundle outputs to `dist/` directory with three formats: CJS, ESM, and type definitions
- External dependencies (React) are not bundled