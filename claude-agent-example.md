# Claude Code Agent Example

This example demonstrates how to create and use a Claude Code agent for the DevBar project.

## Agent Implementation

```typescript
// Example of using a Claude Code agent for code review
const codeReviewAgent = {
  type: 'code-reviewer',
  description: 'Review code for quality and best practices',
  prompt: `
    Please review the following code from the DevBar library:
    - Check for TypeScript best practices
    - Identify potential performance issues
    - Suggest improvements for maintainability
    - Verify proper React patterns are followed
    
    Focus on the main DevToolbar component in src/index.tsx
  `
};

// Example of using a Claude Code agent for documentation
const docGeneratorAgent = {
  type: 'doc-generator', 
  description: 'Generate comprehensive documentation',
  prompt: `
    Generate documentation for the DevBar library including:
    - API reference for all exported components
    - Usage examples for common scenarios
    - Props documentation with TypeScript types
    - Best practices guide
  `
};

// Example of using a Claude Code agent for testing
const testGeneratorAgent = {
  type: 'test-generator',
  description: 'Generate unit tests for components',
  prompt: `
    Create comprehensive unit tests for the DevToolbar component:
    - Test all props and their combinations
    - Test user interactions (clicks, hover effects)
    - Test theme switching
    - Test responsive behavior
    - Use React Testing Library
  `
};
```

## How to Use Claude Code Agents

Claude Code agents are invoked using the Task tool with specific parameters:

1. **subagent_type**: The type of specialized agent (e.g., 'general-purpose', 'statusline-setup', 'output-style-setup')
2. **description**: A short description of the task
3. **prompt**: Detailed instructions for the agent

### Available Agent Types

- **general-purpose**: For complex research, code searching, and multi-step tasks
- **statusline-setup**: For configuring Claude Code status line settings
- **output-style-setup**: For creating Claude Code output styles

### Example Usage in Practice

```typescript
// When you want Claude to use an agent:
// "Please use the general-purpose agent to analyze the codebase architecture"

// The agent will:
// 1. Search through files systematically
// 2. Analyze patterns and structures
// 3. Generate a comprehensive report
// 4. Return findings to the main Claude instance
```

## Integration with DevBar

You could extend DevBar to trigger Claude Code agents for development tasks:

```typescript
import { DevToolbar, useDevToolbarTab } from '@arach/devbar';
import { Code, FileSearch, TestTube } from 'lucide-react';

const DevBarWithAgents = () => {
  const codeReviewTab = useDevToolbarTab(
    'code-review',
    'Review',
    Code,
    () => (
      <div>
        <button onClick={() => {
          // Trigger Claude Code agent for code review
          console.log('Triggering code review agent...');
        }}>
          Run Code Review
        </button>
      </div>
    )
  );

  const searchTab = useDevToolbarTab(
    'search',
    'Search',
    FileSearch,
    () => (
      <div>
        <button onClick={() => {
          // Trigger Claude Code agent for codebase search
          console.log('Triggering search agent...');
        }}>
          Search Codebase
        </button>
      </div>
    )
  );

  const testTab = useDevToolbarTab(
    'tests',
    'Tests',
    TestTube,
    () => (
      <div>
        <button onClick={() => {
          // Trigger Claude Code agent for test generation
          console.log('Triggering test generation agent...');
        }}>
          Generate Tests
        </button>
      </div>
    )
  );

  return (
    <DevToolbar
      tabs={[codeReviewTab, searchTab, testTab]}
      position="bottom-right"
      theme="dark"
      title="DevBar + Agents"
    />
  );
};
```

## Benefits of Using Claude Code Agents

1. **Autonomous Task Execution**: Agents can handle complex, multi-step tasks independently
2. **Parallel Processing**: Launch multiple agents concurrently for different tasks
3. **Specialized Capabilities**: Each agent type has specific tools and permissions
4. **Reduced Context Usage**: Agents help manage context efficiently for large searches

## Best Practices

1. **Be Specific**: Provide detailed prompts with exact requirements
2. **Use the Right Agent**: Choose the appropriate agent type for your task
3. **Batch Operations**: Launch multiple agents together when possible
4. **Trust Results**: Agent outputs are generally reliable and should be trusted