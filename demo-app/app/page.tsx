'use client'

import { useState } from 'react'
import { DevToolbar, DevToolbarSection, DevToolbarButton, DevToolbarInfo, DevToolbarToggle } from '@arach/devbar'
import { Layers, Palette, Settings, Info, Activity, Terminal, Database } from 'lucide-react'

// Configuration
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || 'http://localhost:3001'

export default function DemoPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>('dark')
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'pane'>('bottom-right')
  const [clicks, setClicks] = useState(0)
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  
  // Theme settings
  const [animations, setAnimations] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [soundEffects, setSoundEffects] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Layers,
      content: (
        <div>
          <DevToolbarSection title="Demo Stats" theme={theme}>
            <DevToolbarInfo label="Theme" value={theme} theme={theme} />
            <DevToolbarInfo label="Position" value={position} theme={theme} />
            <DevToolbarInfo label="Button Clicks" value={clicks} theme={theme} />
            <DevToolbarInfo label="Timestamp" value={new Date().toLocaleTimeString()} theme={theme} />
          </DevToolbarSection>
          
          <DevToolbarSection title="Quick Actions" theme={theme}>
            <div className="flex gap-2 flex-wrap">
              <DevToolbarButton onClick={() => setClicks(c => c + 10)} variant="primary">
                +10 Clicks
              </DevToolbarButton>
              <DevToolbarButton onClick={() => setClicks(0)} variant="danger">
                Reset
              </DevToolbarButton>
              <DevToolbarButton 
                onClick={() => {
                  console.log('Refreshing data...');
                  window.location.reload();
                }} 
                variant="success"
              >
                🔄 Refresh
              </DevToolbarButton>
            </div>
          </DevToolbarSection>
        </div>
      )
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: Palette,
      content: (
        <div>
          <DevToolbarSection title="Appearance" theme={theme}>
            <DevToolbarToggle 
              checked={theme === 'dark'}
              onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              label="Dark Mode"
              theme={theme}
            />
            <DevToolbarToggle 
              checked={compactMode}
              onChange={setCompactMode}
              label="Compact Mode"
              theme={theme}
            />
            <DevToolbarToggle 
              checked={animations}
              onChange={setAnimations}
              label="Animations"
              theme={theme}
            />
          </DevToolbarSection>
          
          <DevToolbarSection title="Behavior" theme={theme}>
            <DevToolbarToggle 
              checked={soundEffects}
              onChange={setSoundEffects}
              label="Sound Effects"
              theme={theme}
            />
            <DevToolbarToggle 
              checked={autoRefresh}
              onChange={setAutoRefresh}
              label="Auto Refresh"
              theme={theme}
            />
          </DevToolbarSection>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      content: (
        <DevToolbarSection title="Configuration" theme={theme}>
          <DevToolbarInfo label="Version" value="0.2.0" theme={theme} />
          <DevToolbarInfo label="React" value="19.1.0" theme={theme} />
          <DevToolbarInfo label="Next.js" value="15.4.6" theme={theme} />
          <DevToolbarInfo label="Build" value="Production" theme={theme} />
        </DevToolbarSection>
      )
    },
    {
      id: 'console',
      label: 'Console',
      icon: Terminal,
      content: (
        <DevToolbarSection title="Activity Log" theme={theme}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', lineHeight: 1.4 }}>
            <div style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>[{new Date().toLocaleTimeString()}] Page loaded</div>
            <div style={{ color: theme === 'light' ? '#2563eb' : '#60a5fa' }}>[{new Date().toLocaleTimeString()}] Theme: {theme}</div>
            <div style={{ color: theme === 'light' ? '#059669' : '#10b981' }}>[{new Date().toLocaleTimeString()}] Position: {position}</div>
            <div style={{ color: theme === 'light' ? '#d97706' : '#fbbf24' }}>[{new Date().toLocaleTimeString()}] Clicks: {clicks}</div>
          </div>
        </DevToolbarSection>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      content: (
        <DevToolbarSection title="Metrics" theme={theme}>
          <DevToolbarInfo label="FPS" value="60" theme={theme} />
          <DevToolbarInfo label="Memory" value="12.3 MB" theme={theme} />
          <DevToolbarInfo label="CPU" value="2%" theme={theme} />
          <DevToolbarInfo label="Network" value="Idle" theme={theme} />
        </DevToolbarSection>
      )
    },
    {
      id: 'data',
      label: 'Data',
      icon: Database,
      content: (
        <DevToolbarSection title="Application State">
          <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
{JSON.stringify({ 
  theme, 
  position, 
  clicks,
  timestamp: Date.now() 
}, null, 2)}
          </pre>
        </DevToolbarSection>
      )
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      content: (
        <div>
          <DevToolbarSection title="@arach/devbar">
            <div className="text-xs space-y-2">
              <p>A minimal, beautiful development toolbar for React applications.</p>
              <p className="text-gray-400">Created with ❤️ by arach</p>
            </div>
          </DevToolbarSection>
          
          <DevToolbarSection title="Features">
            <ul className="text-xs space-y-1">
              <li>✓ 5 positioning modes</li>
              <li>✓ Chrome DevTools-style pane</li>
              <li>✓ Resizable with drag handle</li>
              <li>✓ Light/Dark theme support</li>
              <li>✓ Keyboard shortcuts (ESC)</li>
            </ul>
          </DevToolbarSection>
        </div>
      )
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      pageTheme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Top navigation */}
      <div className="absolute top-4 right-4 z-20">
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs px-3 py-1.5 rounded-full transition-all ${
            pageTheme === 'dark'
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Docs →
        </a>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
          pageTheme === 'dark' ? 'bg-slate-700 opacity-10' : 'bg-blue-300 opacity-20'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
          pageTheme === 'dark' ? 'bg-slate-800 opacity-10' : 'bg-purple-300 opacity-20'
        }`} />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Title */}
          <div className="text-center mb-20">
            <h1 className={`text-7xl font-extralight mb-4 tracking-wider ${
              pageTheme === 'dark' ? 'text-slate-200' : 'text-gray-900'
            }`}>
              @arach/devbar
            </h1>
            <p className={`text-xl font-light ${
              pageTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Beautiful development toolbar for React
            </p>
          </div>

          {/* Position buttons - Visual representation */}
          <div className="mb-16">
            <p className={`text-center text-sm mb-8 uppercase tracking-widest ${
              pageTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
            }`}>Choose Position</p>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {/* Top row */}
              <button
                onClick={() => setPosition('top-left')}
                className={`group relative h-32 rounded-2xl border transition-all ${
                  position === 'top-left'
                    ? (pageTheme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300') + ' scale-105'
                    : pageTheme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                      : 'bg-gray-100 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className={`absolute top-2 left-2 w-8 h-8 rounded-full ${
                  pageTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-400'
                }`} />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className={`text-xs ${pageTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Top Left</span>
                </div>
              </button>

              <div className="relative h-32" /> {/* Empty center */}

              <button
                onClick={() => setPosition('top-right')}
                className={`group relative h-32 rounded-2xl border transition-all ${
                  position === 'top-right'
                    ? (pageTheme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300') + ' scale-105'
                    : pageTheme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                      : 'bg-gray-100 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className={`absolute top-2 right-2 w-8 h-8 rounded-full ${
                  pageTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-400'
                }`} />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className={`text-xs ${pageTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Top Right</span>
                </div>
              </button>

              {/* Bottom row */}
              <button
                onClick={() => setPosition('bottom-left')}
                className={`group relative h-32 rounded-2xl border transition-all ${
                  position === 'bottom-left'
                    ? (pageTheme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300') + ' scale-105'
                    : pageTheme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                      : 'bg-gray-100 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className={`absolute bottom-2 left-2 w-8 h-8 rounded-full ${
                  pageTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-400'
                }`} />
                <div className="absolute top-4 left-0 right-0 text-center">
                  <span className={`text-xs ${pageTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Bottom Left</span>
                </div>
              </button>

              <button
                onClick={() => setPosition('pane')}
                className={`group relative h-32 rounded-2xl border transition-all ${
                  position === 'pane'
                    ? (pageTheme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300') + ' scale-105'
                    : pageTheme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                      : 'bg-gray-100 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className={`absolute bottom-0 left-0 right-0 h-1/3 rounded-b-2xl ${
                  pageTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
                }`} />
                <div className="absolute top-4 left-0 right-0 text-center">
                  <span className={`text-xs ${pageTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Pane Mode</span>
                </div>
              </button>

              <button
                onClick={() => setPosition('bottom-right')}
                className={`group relative h-32 rounded-2xl border transition-all ${
                  position === 'bottom-right'
                    ? (pageTheme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300') + ' scale-105'
                    : pageTheme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                      : 'bg-gray-100 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full ${
                  pageTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-400'
                }`} />
                <div className="absolute top-4 left-0 right-0 text-center">
                  <span className={`text-xs ${pageTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Bottom Right</span>
                </div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            <button
              onClick={() => setClicks(c => c + 1)}
              className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border p-6 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                pageTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="relative z-10 text-center">
                <div className={`text-3xl font-light mb-1 ${
                  pageTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'
                }`}>{clicks}</div>
                <div className={`text-xs ${
                  pageTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                }`}>Clicks</div>
              </div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                pageTheme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-700/10 to-slate-600/10'
                  : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50'
              }`} />
            </button>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border p-6 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                pageTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="relative z-10 text-center">
                <div className={`text-3xl font-light mb-1 ${
                  pageTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'
                }`}>
                  {theme === 'light' ? '☀️' : '🌙'}
                </div>
                <div className={`text-xs ${
                  pageTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                }`}>Bar Theme</div>
              </div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                pageTheme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-700/10 to-slate-600/10'
                  : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50'
              }`} />
            </button>

            <button
              onClick={() => setPageTheme(pageTheme === 'light' ? 'dark' : 'light')}
              className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border p-6 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                pageTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="relative z-10 text-center">
                <div className={`text-3xl font-light mb-1 ${
                  pageTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'
                }`}>
                  {pageTheme === 'light' ? '🌞' : '🌚'}
                </div>
                <div className={`text-xs ${
                  pageTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                }`}>Page Theme</div>
              </div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                pageTheme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-700/10 to-slate-600/10'
                  : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50'
              }`} />
            </button>

            <button
              onClick={() => setClicks(0)}
              className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border p-6 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                pageTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="relative z-10 text-center">
                <div className={`text-3xl font-light mb-1 ${
                  pageTheme === 'dark' ? 'text-slate-200' : 'text-gray-800'
                }`}>↺</div>
                <div className={`text-xs ${
                  pageTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                }`}>Reset</div>
              </div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                pageTheme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-700/10 to-slate-600/10'
                  : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50'
              }`} />
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p className={`text-sm font-light ${
              pageTheme === 'dark' ? 'text-slate-600' : 'text-gray-500'
            }`}>
              Look for the bug icon 🐛 {position === 'pane' ? 'in the bottom-right corner' : `in the ${position.replace('-', ' ')}`}
            </p>
            {position === 'pane' && (
              <p className={`text-sm font-light ${
                pageTheme === 'dark' ? 'text-slate-600' : 'text-gray-500'
              }`}>
                Drag to resize • ESC to close
              </p>
            )}
            <button
              onClick={() => setIsToolbarOpen(!isToolbarOpen)}
              className={`mt-4 px-4 py-2 text-xs rounded-lg transition-all ${
                pageTheme === 'dark' 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isToolbarOpen ? 'Start Closed' : 'Start Open'} on Position Change
            </button>
          </div>
        </div>
      </div>

      {/* DevToolbar - key forces remount on position change to avoid transition */}
      <DevToolbar
        key={position}
        tabs={tabs}
        position={position}
        theme={theme}
        title="Demo"
        hideInProduction={false}
        defaultPaneHeight="320px"
        defaultOpen={isToolbarOpen}
      />
    </div>
  )
}