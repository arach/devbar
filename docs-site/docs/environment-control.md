# Environment Control

The DevToolbar provides flexible ways to control when it appears based on your application's environment.

## Approaches

### 1. Explicit Environment Prop (Recommended)

Pass your app's environment explicitly - the toolbar doesn't guess:

```jsx
import { DevToolbar } from '@arach/devbar';

function App() {
  const environment = process.env.REACT_APP_ENV || 'development';
  
  return (
    <>
      <YourApp />
      <DevToolbar 
        tabs={tabs} 
        environment={environment}
        hideInProduction={true}  // Only hide when environment === 'production'
      />
    </>
  );
}
```

### 2. Conditional Rendering (Most Control)

Handle visibility entirely in your application:

```jsx
function App() {
  const showDevTools = process.env.NODE_ENV === 'development' || 
                       process.env.REACT_APP_SHOW_DEV_TOOLS === 'true';
  
  return (
    <>
      <YourApp />
      {showDevTools && <DevToolbar tabs={tabs} />}
    </>
  );
}
```

### 3. Always Show (Staging/Demo)

For staging environments or demos:

```jsx
// Always visible regardless of environment
<DevToolbar 
  tabs={tabs} 
  hideInProduction={false}
/>
```

### 4. Custom Environment Logic

Support multiple environments with custom logic:

```jsx
function App() {
  const env = process.env.REACT_APP_ENV || 'development';
  
  // Show in dev and staging, hide in production
  const showInEnvironments = ['development', 'staging', 'test'];
  
  return (
    <>
      <YourApp />
      <DevToolbar 
        tabs={tabs}
        environment={env}
        hideInProduction={!showInEnvironments.includes(env)}
      />
    </>
  );
}
```

## Environment Priority

The toolbar uses this priority order:

1. **`hideInProduction={false}`** - Always shows (highest priority)
2. **`environment` prop** - If provided, hides when `environment === 'production'`
3. **`NODE_ENV`** - Falls back to checking `process.env.NODE_ENV === 'production'`
4. **Default** - Shows if none of the above are defined

## Framework Examples

### Next.js

```jsx
// pages/_app.tsx or app/layout.tsx
import { DevToolbar } from '@arach/devbar';

function MyApp({ Component, pageProps }) {
  const isDev = process.env.NODE_ENV === 'development';
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
  
  return (
    <>
      <Component {...pageProps} />
      <DevToolbar 
        tabs={tabs}
        environment={isPreview ? 'staging' : process.env.NODE_ENV}
      />
    </>
  );
}
```

### Vite

```jsx
// App.tsx
import { DevToolbar } from '@arach/devbar';

function App() {
  return (
    <>
      <YourApp />
      <DevToolbar 
        tabs={tabs}
        environment={import.meta.env.MODE}
        hideInProduction={import.meta.env.PROD}
      />
    </>
  );
}
```

### Create React App

```jsx
// App.tsx
import { DevToolbar } from '@arach/devbar';

function App() {
  // CRA sets NODE_ENV automatically
  // Use custom env vars with REACT_APP_ prefix
  const environment = process.env.REACT_APP_ENV || process.env.NODE_ENV;
  
  return (
    <>
      <YourApp />
      <DevToolbar 
        tabs={tabs}
        environment={environment}
      />
    </>
  );
}
```

## Best Practices

1. **Be Explicit**: Pass the `environment` prop for clarity
2. **Use Conditional Rendering**: For complete control over visibility
3. **Document Your Choice**: Make it clear to your team when the toolbar appears
4. **Consider Security**: Never expose sensitive data in the toolbar
5. **Test All Environments**: Verify the toolbar behaves correctly in dev, staging, and production

## Security Note

The DevToolbar is designed for development and debugging. Even when shown in production:

- Only include non-sensitive debugging information
- Consider authentication/authorization if exposing to users
- Use feature flags to control access
- Never expose API keys, tokens, or secrets

## Examples

### Feature Flag Control

```jsx
function App() {
  const { flags } = useFeatureFlags();
  const user = useCurrentUser();
  
  const showDevTools = flags.devToolsEnabled && 
                       user?.role === 'developer';
  
  return (
    <>
      <YourApp />
      {showDevTools && (
        <DevToolbar 
          tabs={tabs}
          hideInProduction={false}  // We control visibility above
        />
      )}
    </>
  );
}
```

### Environment Banner

Show different toolbar titles based on environment:

```jsx
function App() {
  const env = process.env.REACT_APP_ENV || 'development';
  
  const envConfig = {
    development: { title: 'Dev', theme: 'dark' },
    staging: { title: 'Staging', theme: 'light' },
    production: { title: 'Debug', theme: 'dark' }
  };
  
  return (
    <>
      <YourApp />
      <DevToolbar 
        tabs={tabs}
        environment={env}
        title={envConfig[env]?.title || 'Dev'}
        theme={envConfig[env]?.theme || 'auto'}
      />
    </>
  );
}
```