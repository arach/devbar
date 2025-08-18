'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Book, Rocket, Code, Settings, Lightbulb, Layers, Copy, Check } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'

// Disable Prism's automatic highlighting to prevent hydration issues
if (typeof window !== 'undefined') {
  Prism.manual = true
}

// Configuration
const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL || 'http://localhost:3000'

const sections = [
  { id: 'overview', title: 'Overview', icon: Book, file: 'index.md' },  // Changed from README.md to index.md
  { id: 'getting-started', title: 'Getting Started', icon: Rocket, file: 'getting-started.md' },
  { id: 'api-reference', title: 'API Reference', icon: Code, file: 'api-reference.md' },
  { id: 'configuration', title: 'Configuration', icon: Settings, file: 'configuration.md' },
  { id: 'examples', title: 'Examples', icon: Lightbulb, file: 'examples.md' },
  { id: 'advanced', title: 'Advanced', icon: Layers, file: 'advanced.md' },
]

function CodeBlock({ code, language, theme }: { code: string; language: string; theme: 'light' | 'dark' }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className={`absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        aria-label="Copy code"
      >
        {copied ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
        )}
      </button>
      <pre className={`${
        theme === 'dark' 
          ? 'bg-gray-900' 
          : 'bg-gray-50 border border-gray-200'
      } rounded-lg overflow-x-auto`}>
        <code className={`text-xs leading-relaxed block p-2`} data-language={language}>
          {code}
        </code>
      </pre>
    </div>
  )
}

export default function DocsClient({ docsJson }: { docsJson: string }) {
  const [activeSection, setActiveSection] = useState('overview')  // Changed from 'readme' to 'overview'
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)
  
  // Parse the JSON string back to object
  const docs = JSON.parse(docsJson) as Record<string, string>
  
  // Mark as mounted
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Load appropriate Prism theme based on current theme  
  useEffect(() => {
    if (!mounted) return
    
    // Remove any existing theme
    const existingTheme = document.querySelector('link[data-prism-theme]')
    if (existingTheme) {
      existingTheme.remove()
    }
    
    // Add new theme
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.setAttribute('data-prism-theme', 'true')
    link.href = theme === 'dark' 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css'
    document.head.appendChild(link)
    
    // Re-highlight after theme change
    setTimeout(() => {
      // Manually highlight with proper language classes
      document.querySelectorAll('code[data-language]').forEach((block) => {
        const language = block.getAttribute('data-language') || 'javascript'
        if (!block.classList.contains(`language-${language}`)) {
          block.classList.add(`language-${language}`)
          const pre = block.parentElement
          if (pre && pre.tagName === 'PRE' && !pre.classList.contains(`language-${language}`)) {
            pre.classList.add(`language-${language}`)
          }
        }
      })
      Prism.highlightAll()
    }, 100)
  }, [theme, mounted])

  const content = docs[sections.find(s => s.id === activeSection)?.file || 'README.md'] || ''

  useEffect(() => {
    // Only highlight after mount to prevent hydration issues
    if (mounted) {
      setTimeout(() => Prism.highlightAll(), 100)
    }
  }, [content, mounted])

  const renderMarkdown = (text: string, theme: 'light' | 'dark', sectionId: string) => {
    // Track if we're inside a list
    let inList = false
    
    // Process line by line for better list handling
    const lines = text.split('\n')
    const processedLines: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      
      // Check if this is a list item
      const isListItem = /^[\-\*]\s/.test(line) || /^\d+\.\s/.test(line)
      
      if (isListItem && !inList) {
        const listClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        processedLines.push(`<ul class="list-disc list-inside mb-4 space-y-1 ${listClass}">`)
        inList = true
      } else if (!isListItem && inList && line.trim() === '') {
        processedLines.push('</ul>')
        inList = false
      }
      
      if (isListItem) {
        line = line.replace(/^[\-\*]\s/, '<li>') + '</li>'
        line = line.replace(/^\d+\.\s/, '<li>')
      }
      
      processedLines.push(line)
    }
    
    if (inList) {
      processedLines.push('</ul>')
    }
    
    let html = processedLines.join('\n')
    
    // Headers with theme-aware colors
    const headerColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    html = html
      .replace(/^#### (.*$)/gim, `<h4 class="text-sm font-semibold mt-4 mb-2 ${headerColor}">$1</h4>`)
      .replace(/^### (.*$)/gim, `<h3 class="text-base font-semibold mt-6 mb-3 ${headerColor}">$1</h3>`)
      .replace(/^## (.*$)/gim, `<h2 class="text-xl font-bold mt-8 mb-4 ${headerColor}">$1</h2>`)
      .replace(/^# (.*$)/gim, `<h1 class="text-2xl font-bold mb-6 ${headerColor}">$1</h1>`)
    
    // Extract and render code blocks separately
    const codeBlocks: { placeholder: string; component: JSX.Element }[] = []
    let blockIndex = 0
    
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const placeholder = `__CODE_BLOCK_${blockIndex}__`
      const language = lang || 'javascript'
      codeBlocks.push({
        placeholder,
        component: <CodeBlock key={`codeblock-${sectionId}-${blockIndex}`} code={code.trim()} language={language} theme={theme} />
      })
      blockIndex++
      return placeholder
    })
    
    // Inline code with theme support
    const inlineCodeClass = theme === 'dark' 
      ? 'bg-gray-800 text-blue-400' 
      : 'bg-blue-50 text-blue-700 border border-blue-200'
    html = html.replace(/`([^`]+)`/g, `<code class="${inlineCodeClass} px-1 py-0.5 rounded text-xs font-mono">$1</code>`)
    
    // Bold and italic
    html = html
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold italic">$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Links with theme support
    const linkClass = theme === 'dark' 
      ? 'text-blue-400 hover:text-blue-300' 
      : 'text-blue-600 hover:text-blue-800'
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" class="${linkClass} underline">$1</a>`)
    
    // Tables - more robust handling
    const tableRegex = /(\|[^\n]+\|\n)+/g
    html = html.replace(tableRegex, (tableMatch) => {
      const rows = tableMatch.trim().split('\n')
      const tableBorderClass = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
      let tableHtml = `<table class="w-full mb-6 text-xs border ${tableBorderClass} rounded-lg overflow-hidden">`
      let isFirstRow = true
      
      rows.forEach((row, index) => {
        // Skip separator rows
        if (row.includes('---|') || row.includes('---')) return
        
        // More careful splitting that preserves escaped content
        const cells: string[] = []
        let current = ''
        let escaped = false
        
        for (let i = 0; i < row.length; i++) {
          const char = row[i]
          const nextChar = row[i + 1]
          
          if (char === '\\' && nextChar === '|') {
            current += '|'
            i++ // Skip the next character
            escaped = true
          } else if (char === '|' && !escaped) {
            if (current.trim() || cells.length > 0) {
              cells.push(current)
            }
            current = ''
          } else {
            current += char
            escaped = false
          }
        }
        
        // Add last cell if exists
        if (current.trim()) {
          cells.push(current)
        }
        
        // Filter out empty cells but keep cells with actual content
        const filteredCells = cells.filter((cell, idx) => 
          cell.trim() || (idx > 0 && idx < cells.length - 1)
        )
        
        if (filteredCells.length === 0) return
        
        const tag = isFirstRow ? 'th' : 'td'
        const cellClass = isFirstRow 
          ? theme === 'dark'
            ? 'p-2 text-left font-semibold bg-gray-900 border-b border-gray-700 text-gray-300' 
            : 'p-2 text-left font-semibold bg-gray-100 border-b border-gray-300 text-gray-700'
          : theme === 'dark'
            ? 'p-2 border-b border-gray-800 text-gray-400'
            : 'p-2 border-b border-gray-200 text-gray-600'
        
        const rowHoverClass = theme === 'dark' ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'
        tableHtml += `<tr class="${rowHoverClass}">`
        filteredCells.forEach(cell => {
          // Clean up the cell content
          let content = cell.trim()
          
          // Handle code blocks in cells with theme support
          const cellCodeClass = theme === 'dark' 
            ? 'text-blue-400 bg-gray-800' 
            : 'text-blue-600 bg-blue-50'
          content = content.replace(/`([^`]+)`/g, `<code class="${cellCodeClass} px-1 rounded text-xs">$1</code>`)
          
          // Handle bold
          content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          
          // Handle italics
          content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
          
          // Special handling for type unions (common in TypeScript docs)
          content = content.replace(/&#39;/g, "'")
          content = content.replace(/&quot;/g, '"')
          
          // Wrap type definitions in code blocks if they look like types
          if (!isFirstRow && content.includes("'") && content.includes("|")) {
            // This looks like a TypeScript type union
            const parts = content.split(/\s+/)
            if (parts.length === 1) {
              const typeCodeClass = theme === 'dark' 
                ? 'text-blue-400 bg-gray-800' 
                : 'text-blue-600 bg-blue-50'
              content = `<code class="${typeCodeClass} px-1 rounded text-xs font-mono">${content}</code>`
            }
          }
          
          tableHtml += `<${tag} class="${cellClass}">${content}</${tag}>`
        })
        tableHtml += '</tr>'
        
        if (isFirstRow) isFirstRow = false
      })
      
      tableHtml += '</table>'
      return tableHtml
    })
    
    // Paragraphs
    html = html
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.startsWith('<') || paragraph.includes('__CODE_BLOCK_')) {
          return paragraph
        }
        if (paragraph.trim()) {
          const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          return `<p class="mb-4 ${textColor}">${paragraph}</p>`
        }
        return ''
      })
      .join('\n')
    
    // Return with code blocks as React components
    if (codeBlocks.length > 0) {
      const parts = html.split(/__CODE_BLOCK_\d+__/)
      const elements: (string | JSX.Element)[] = []
      
      parts.forEach((part, index) => {
        if (part) elements.push(part)
        if (index < codeBlocks.length) {
          elements.push(codeBlocks[index].component)
        }
      })
      
      return elements
    }
    
    return html
  }

  const renderedContent = renderMarkdown(content, theme, activeSection)
  const isArray = Array.isArray(renderedContent)

  // Always render with dark theme initially to prevent flash
  return (
    <div className={`min-h-screen ${!mounted || theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 h-screen sticky top-0 border-r ${
          !mounted || theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="p-6">
            <h1 className="text-xl font-bold mb-1">@arach/devbar</h1>
            <p className={`text-sm ${!mounted || theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>v0.2.0</p>
          </div>
          
          <nav className="px-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                    activeSection === section.id
                      ? !mounted || theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : !mounted || theme === 'dark'
                        ? 'hover:bg-gray-800/50 text-gray-400 hover:text-gray-200'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{section.title}</span>
                  {activeSection === section.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              )
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <a 
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`block text-center text-sm py-2 px-4 rounded-lg transition-colors ${
                !mounted || theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              View Demo →
            </a>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-full mt-2 text-center text-sm py-2 px-4 rounded-lg transition-colors ${
                !mounted || theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {!mounted || theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="prose prose-lg max-w-none">
              {isArray ? (
                renderedContent.map((item, index) => 
                  typeof item === 'string' ? (
                    <div key={`content-${index}`} dangerouslySetInnerHTML={{ __html: item }} />
                  ) : (
                    <div key={`codeblock-${index}`}>{item}</div>
                  )
                )
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderedContent as string }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Override Prism styles for smaller font */
        pre[class*="language-"] {
          font-size: 0.75rem !important;
          line-height: 1.5 !important;
        }
        
        code[class*="language-"] {
          font-size: 0.75rem !important;
        }
        
        /* Custom scrollbar for code blocks */
        pre::-webkit-scrollbar {
          height: 6px;
        }
        
        pre::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        pre::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        pre::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}