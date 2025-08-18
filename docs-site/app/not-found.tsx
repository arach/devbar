'use client'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8">Page not found</p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          Back to docs
        </a>
      </div>
    </div>
  )
}