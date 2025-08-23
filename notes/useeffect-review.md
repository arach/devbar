# useEffect Usage Review & Recommendations

## Current useEffect Usage Analysis

### 1. Production Detection Effect (`src/index.tsx:93-103`)

**Current Implementation:**
```tsx
useEffect(() => {
  const isDevelopment = process.env.NODE_ENV === 'development' || 
    (process.env.NODE_ENV === undefined && typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1'));
  
  const shouldShow = !hideInProduction || isDevelopment;
  setIsVisible(shouldShow);
}, [hideInProduction]);
```

**Issues:**
- Unnecessary effect for a deterministic calculation
- Causes extra render cycle
- Could lead to hydration mismatches in SSR

**Recommendation:**
```tsx
// Better: Use useMemo or direct calculation
const isVisible = useMemo(() => {
  if (typeof window === 'undefined') return false; // SSR safety
  
  const isDevelopment = process.env.NODE_ENV === 'development' || 
    (process.env.NODE_ENV === undefined && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1'));
  
  return !hideInProduction || isDevelopment;
}, [hideInProduction]);
```

### 2. Pane Resize Handler (`src/index.tsx:106-130`)

**Current Implementation:**
```tsx
useEffect(() => {
  if (!isResizing) return;
  
  const handleMouseMove = (e: MouseEvent) => {
    const newHeight = window.innerHeight - e.clientY;
    const minHeight = 100;
    const maxHeight = window.innerHeight * 0.8;
    
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setPaneHeight(`${newHeight}px`);
    }
  };
  
  const handleMouseUp = () => {
    setIsResizing(false);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing]);
```

**Assessment:** ✅ Good implementation
- Proper cleanup
- Conditional registration
- Correct dependencies

**Minor Enhancement:**
```tsx
// Could add throttling for performance
const handleMouseMove = useCallback(
  throttle((e: MouseEvent) => {
    const newHeight = window.innerHeight - e.clientY;
    const minHeight = 100;
    const maxHeight = window.innerHeight * 0.8;
    
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setPaneHeight(`${newHeight}px`);
    }
  }, 16), // ~60fps
  []
);
```

### 3. ESC Key Handler (`src/index.tsx:133-144`)

**Current Implementation:**
```tsx
useEffect(() => {
  if (position !== 'pane' || isCollapsed) return;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCollapsed(true);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [position, isCollapsed]);
```

**Assessment:** ✅ Good implementation
- Proper cleanup
- Correct conditional logic
- Appropriate dependencies

**Minor Enhancement:**
```tsx
// Could use a more specific event target to avoid conflicts
useEffect(() => {
  if (position !== 'pane' || isCollapsed) return;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    // Check if toolbar is focused or active
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.preventDefault();
      setIsCollapsed(true);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [position, isCollapsed]);
```

### 4. Documentation Examples

#### Hydration Fix Example (`troubleshooting.md:71-74`)
```tsx
useEffect(() => {
  setMounted(true);
}, []);
```

**Issue:** Common anti-pattern for SSR hydration
**Better Approach:**
```tsx
// Use dynamic import with ssr: false (shown in docs)
// Or use a custom hook:
function useIsClient() {
  // This will be false on server and first client render
  // Then true after hydration
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}
```

#### Memory Leak Example (`troubleshooting.md:197-204`)
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Update logic
  }, 1000);
  
  return () => clearInterval(interval); // Clean up!
}, []);
```

**Assessment:** ✅ Good example showing proper cleanup

#### External Control Example (`api-reference.md:334-342`)
```tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'd') {
      setIsToolbarOpen(prev => !prev);
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

**Assessment:** ✅ Good example with proper cleanup

## General Recommendations

### 1. Remove Unnecessary Effects

The production detection effect should be removed in favor of:
- Direct calculation during render
- useMemo if computation is expensive
- Lazy initial state for useState

### 2. Performance Optimizations

Consider these patterns for better performance:

```tsx
// Use lazy initial state for expensive computations
const [state, setState] = useState(() => {
  // Expensive initial calculation
  return computeInitialState();
});

// Use useLayoutEffect for DOM measurements
useLayoutEffect(() => {
  // Measure DOM before browser paint
}, []);

// Debounce/throttle event handlers
const debouncedHandler = useMemo(
  () => debounce(handler, 300),
  [handler]
);
```

### 3. Custom Hooks for Reusable Logic

Extract common patterns into custom hooks:

```tsx
// useEventListener hook
function useEventListener(
  eventName: string,
  handler: EventListener,
  element = window,
  options?: AddEventListenerOptions
) {
  const savedHandler = useRef(handler);
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const eventListener = (event: Event) => savedHandler.current(event);
    
    element.addEventListener(eventName, eventListener, options);
    return () => element.removeEventListener(eventName, eventListener, options);
  }, [eventName, element, options]);
}

// Usage in DevToolbar
useEventListener('keydown', (e) => {
  if (e.key === 'Escape' && position === 'pane' && !isCollapsed) {
    setIsCollapsed(true);
  }
});
```

### 4. SSR-Safe Patterns

For better SSR compatibility:

```tsx
// Check for client-side before using browser APIs
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

// Or use a utility
const canUseDOM = typeof window !== 'undefined';

// Use in render
if (!canUseDOM) return null;
```

### 5. Avoid Effect Chains

Current code is good - no effect chains detected. Continue avoiding patterns like:

```tsx
// BAD: Effect chains
useEffect(() => {
  setSomeState(value);
}, [prop]);

useEffect(() => {
  // Do something with someState
}, [someState]);

// GOOD: Direct derivation
const derivedValue = computeFrom(prop);
```

## Priority Actions

1. **HIGH**: Remove production detection useEffect - causes unnecessary renders and potential hydration issues
2. **MEDIUM**: Add throttling to resize handler for better performance
3. **LOW**: Extract reusable patterns into custom hooks for maintainability
4. **LOW**: Add preventDefault to ESC handler to avoid conflicts

## Memory & Performance Considerations

Current implementation is generally good:
- ✅ All event listeners have cleanup
- ✅ No infinite loops or effect chains
- ✅ Dependencies are correctly specified
- ⚠️ One unnecessary effect for production detection

## Conclusion

The codebase shows good understanding of useEffect patterns with proper cleanup and dependency management. The main improvement would be removing the production detection effect in favor of direct calculation or useMemo. The resize and keyboard handlers are well-implemented with proper cleanup. Documentation examples are accurate and demonstrate best practices.