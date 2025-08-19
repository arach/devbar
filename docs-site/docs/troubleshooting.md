# Troubleshooting

Common issues and solutions when using @arach/devbar.

## Toolbar Not Appearing

### In Development

**Problem**: The toolbar doesn't show up in development environment.

**Solutions**:

1. **Check NODE_ENV**: Ensure `process.env.NODE_ENV` is set to `'development'`
   ```jsx
   console.log(process.env.NODE_ENV); // Should output 'development'
   ```

2. **Verify hideInProduction prop**: Make sure you haven't set `hideInProduction={false}`
   ```jsx
   // This will hide the toolbar even in development
   <DevToolbar tabs={tabs} hideInProduction={true} />
   ```

3. **Check mounting**: Ensure the component is actually mounting
   ```jsx
   useEffect(() => {
     console.log('DevToolbar mounted');
   }, []);
   ```

### In Production

**Problem**: The toolbar appears in production when it shouldn't.

**Solutions**:

1. **Set hideInProduction**: Explicitly set the prop (default is true)
   ```jsx
   <DevToolbar tabs={tabs} hideInProduction={true} />
   ```

2. **Check build configuration**: Ensure your bundler sets NODE_ENV correctly
   ```json
   // webpack.config.js
   plugins: [
     new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
     })
   ]
   ```

## Hydration Mismatches (SSR)

**Problem**: "Hydration failed because the initial UI does not match what was rendered on the server"

**Solutions**:

1. **Use dynamic import with SSR disabled** (Next.js):
   ```jsx
   import dynamic from 'next/dynamic';
   
   const DevToolbar = dynamic(
     () => import('@arach/devbar').then(mod => mod.DevToolbar),
     { ssr: false }
   );
   ```

2. **Conditional rendering after mount**:
   ```jsx
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   
   return mounted ? <DevToolbar tabs={tabs} /> : null;
   ```

## Z-Index Conflicts

**Problem**: Toolbar appears behind other elements or overlaps incorrectly.

**Solutions**:

1. **Adjust container z-index**: The toolbar uses `z-index: 9999` by default
   ```css
   /* Ensure your modals/overlays use higher values */
   .my-modal {
     z-index: 10000;
   }
   ```

2. **Use pane mode**: For complex layouts, pane mode avoids z-index issues
   ```jsx
   <DevToolbar tabs={tabs} position="pane" />
   ```

## TypeScript Errors

### Missing Types

**Problem**: "Cannot find module '@arach/devbar' or its corresponding type declarations"

**Solution**: Install the package with npm/yarn/pnpm:
```bash
npm install @arach/devbar
# or
yarn add @arach/devbar
# or
pnpm add @arach/devbar
```

### Icon Type Errors

**Problem**: "Type 'IconType' is not assignable to type 'ComponentType<{...}>'"

**Solution**: Use icons from lucide-react specifically:
```tsx
import { Settings, Bug, Activity } from 'lucide-react';
// NOT from react-icons or other libraries
```

## Styling Issues

### Fonts Not Loading

**Problem**: Text appears in fallback fonts or looks incorrect.

**Solution**: The toolbar uses system fonts. If you need custom fonts:
```jsx
<div style={{ fontFamily: 'your-font, system-ui, sans-serif' }}>
  <DevToolbar tabs={tabs} />
</div>
```

### Theme Not Applying

**Problem**: Dark/light theme not working as expected.

**Solutions**:

1. **Check theme prop**:
   ```jsx
   <DevToolbar tabs={tabs} theme="dark" /> // Force dark
   <DevToolbar tabs={tabs} theme="light" /> // Force light
   <DevToolbar tabs={tabs} theme="auto" /> // Match system
   ```

2. **System preference detection**: For 'auto' theme, check system preferences:
   ```jsx
   // Check what the system preference is
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   console.log('System prefers dark:', prefersDark);
   ```

## Performance Issues

### Slow Renders

**Problem**: Toolbar causes performance issues or slow renders.

**Solutions**:

1. **Use function content for dynamic data**:
   ```jsx
   // Good - only re-renders when toolbar is open
   const tab = {
     id: 'metrics',
     label: 'Metrics',
     content: () => <ExpensiveComponent />
   };
   
   // Bad - always renders
   const tab = {
     id: 'metrics',
     label: 'Metrics',
     content: <ExpensiveComponent />
   };
   ```

2. **Memoize tab configurations**:
   ```jsx
   const tabs = useMemo(() => [
     { id: 'tab1', label: 'Tab 1', content: <Content1 /> },
     { id: 'tab2', label: 'Tab 2', content: <Content2 /> }
   ], [/* dependencies */]);
   ```

### Memory Leaks

**Problem**: Memory usage increases over time.

**Solutions**:

1. **Clean up intervals/subscriptions in tab content**:
   ```jsx
   function TabContent() {
     useEffect(() => {
       const interval = setInterval(() => {
         // Update logic
       }, 1000);
       
       return () => clearInterval(interval); // Clean up!
     }, []);
     
     return <div>Content</div>;
   }
   ```

## Content Rendering Issues

### Content Not Updating

**Problem**: Tab content doesn't update when state changes.

**Solutions**:

1. **Use function content for reactive updates**:
   ```jsx
   const [count, setCount] = useState(0);
   
   const tabs = [{
     id: 'counter',
     label: 'Counter',
     // This will update when count changes
     content: () => <div>Count: {count}</div>
   }];
   ```

2. **Force re-render with key**:
   ```jsx
   <DevToolbar key={someValue} tabs={tabs} />
   ```

### Scroll Issues in Pane Mode

**Problem**: Content doesn't scroll properly in pane mode.

**Solution**: Add overflow styles to your content:
```jsx
const content = (
  <div style={{ height: '100%', overflowY: 'auto' }}>
    {/* Your scrollable content */}
  </div>
);
```

## Browser Compatibility

### Not Working in Safari

**Problem**: Toolbar doesn't work correctly in Safari.

**Solutions**:

1. **Check Safari version**: Requires Safari 14+
2. **Check for console errors**: Safari may have different security policies
3. **Test in private mode**: Extensions might interfere

### Mobile Issues

**Problem**: Toolbar doesn't work well on mobile devices.

**Solution**: Consider hiding on mobile:
```jsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

return !isMobile ? <DevToolbar tabs={tabs} /> : null;
```

## Build & Deployment Issues

### Bundle Size Concerns

**Problem**: Bundle size is larger than expected.

**Solutions**:

1. **Check if tree-shaking is working**:
   ```jsx
   // Only import what you need
   import { DevToolbar } from '@arach/devbar';
   // Not: import * as DevBar from '@arach/devbar';
   ```

2. **Load conditionally in development only**:
   ```jsx
   const DevToolbar = process.env.NODE_ENV === 'development' 
     ? require('@arach/devbar').DevToolbar 
     : () => null;
   ```

### Module Resolution Errors

**Problem**: "Module not found" or resolution errors.

**Solution**: Check your bundler configuration:
```js
// webpack.config.js
resolve: {
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  modules: ['node_modules']
}
```

## Common Build Tool Issues

### Webpack

**Problem**: Module not found or resolution errors with Webpack.

**Solutions**:

1. **Ensure proper module resolution**:
   ```js
   // webpack.config.js
   module.exports = {
     resolve: {
       extensions: ['.tsx', '.ts', '.jsx', '.js'],
       alias: {
         '@arach/devbar': path.resolve(__dirname, 'node_modules/@arach/devbar')
       }
     }
   };
   ```

2. **Handle process.env for production detection**:
   ```js
   // webpack.config.js
   const webpack = require('webpack');
   
   module.exports = {
     plugins: [
       new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
       })
     ]
   };
   ```

### Vite

**Problem**: ESM/CJS compatibility issues with Vite.

**Solutions**:

1. **Optimize dependencies**:
   ```js
   // vite.config.js
   export default {
     optimizeDeps: {
       include: ['@arach/devbar']
     }
   };
   ```

2. **Handle SSR builds**:
   ```js
   // vite.config.js
   export default {
     ssr: {
       noExternal: ['@arach/devbar']
     }
   };
   ```

### Next.js

**Problem**: Server-side rendering errors or hydration mismatches.

**Solutions**:

1. **Use dynamic imports** (recommended):
   ```jsx
   import dynamic from 'next/dynamic';
   
   const DevToolbar = dynamic(
     () => import('@arach/devbar').then(mod => mod.DevToolbar),
     { ssr: false }
   );
   ```

2. **Configure transpilation** (if needed):
   ```js
   // next.config.js
   module.exports = {
     transpilePackages: ['@arach/devbar']
   };
   ```

### Create React App (CRA)

**Problem**: Module resolution or build errors.

**Solution**: CRA should work out of the box. If issues persist:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Parcel

**Problem**: Type errors or module resolution issues.

**Solutions**:

1. **Ensure TypeScript support**:
   ```json
   // .parcelrc
   {
     "extends": "@parcel/config-default",
     "transformers": {
       "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
     }
   }
   ```

2. **Clear cache if needed**:
   ```bash
   rm -rf .parcel-cache
   parcel build
   ```

### Rollup

**Problem**: Peer dependency warnings or bundle size issues.

**Solutions**:

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  plugins: [
    peerDepsExternal(), // Exclude peer deps
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    commonjs()
  ],
  external: ['react', 'react-dom'] // Mark as external
};
```

### esbuild

**Problem**: JSX transform errors.

**Solution**:

```js
// build.js
require('esbuild').build({
  entryPoints: ['src/index.tsx'],
  jsx: 'automatic', // Use React 17+ JSX transform
  jsxImportSource: 'react',
  bundle: true,
  external: ['react', 'react-dom']
});
```

## Package Manager Compatibility

### npm

**Installation**:
```bash
npm install @arach/devbar
```

**Common issues**:
- Peer dependency warnings: Run `npm install --legacy-peer-deps` if needed
- Lock file conflicts: Delete `package-lock.json` and reinstall

### yarn

**Installation**:
```bash
yarn add @arach/devbar
```

**Common issues**:
- Resolution errors: Add to `package.json`:
  ```json
  "resolutions": {
    "@arach/devbar": "^1.0.0"
  }
  ```
- Cache issues: Run `yarn cache clean`

### pnpm

**Installation**:
```bash
pnpm add @arach/devbar
```

**Common issues**:
- Hoisting problems: Configure `.npmrc`:
  ```ini
  # .npmrc
  shamefully-hoist=true
  ```
- Workspace issues: Add to `pnpm-workspace.yaml` if needed

### bun

**Installation**:
```bash
bun add @arach/devbar
```

**Common issues**:
- TypeScript types: Ensure `bun-types` is installed
- Build issues: Use `bun run build` instead of npm scripts

### Package Manager Comparison

| Feature | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| Speed | Medium | Fast | Fast | Fastest |
| Disk Space | High | Medium | Low | Low |
| Lock File | package-lock.json | yarn.lock | pnpm-lock.yaml | bun.lockb |
| Workspaces | ✅ | ✅ | ✅ | ✅ |
| Auto-install peers | ❌ (v7+) | ❌ | ✅ | ✅ |

### Switching Package Managers

When switching between package managers:

1. **Delete old lock files and node_modules**:
   ```bash
   rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml bun.lockb
   ```

2. **Install with new package manager**:
   ```bash
   # Choose one:
   npm install
   yarn install
   pnpm install
   bun install
   ```

3. **Update scripts if needed**:
   ```json
   // package.json
   {
     "scripts": {
       "dev": "your-dev-command",
       "build": "your-build-command"
     }
   }
   ```

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/arach/devbar/issues)
2. Review the [Examples](./examples.md) for working implementations
3. Ensure you're using the latest version
4. Create a minimal reproduction and open an issue

### Debug Information to Include

When reporting issues, include:

```jsx
console.log({
  version: '@arach/devbar version from package.json',
  nodeEnv: process.env.NODE_ENV,
  browser: navigator.userAgent,
  react: React.version,
  props: /* your DevToolbar props */,
  bundler: 'webpack/vite/next/etc',
  packageManager: 'npm/yarn/pnpm/bun'
});
```