import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gradient mb-4">
            Mento 🌟
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your friendly mental health companion
          </p>
          <div className="card max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Development Setup Complete! 🎉</h2>
            <p className="text-gray-600 mb-6">
              React + Vite + Tailwind CSS is now configured and ready for development.
            </p>
            <button 
              className="btn-primary w-full"
              onClick={() => setCount((count) => count + 1)}
            >
              Click me! Count: {count}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card hover:scale-105 transition-transform duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🎯 Ready Features
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>✅ React + Vite setup</li>
                <li>✅ Tailwind CSS configured</li>
                <li>✅ Framer Motion ready</li>
                <li>✅ Development scripts</li>
                <li>✅ Environment variables</li>
              </ul>
            </div>

            <div className="card hover:scale-105 transition-transform duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🚀 Next Steps
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Install dependencies</li>
                <li>• Start development server</li>
                <li>• Build React components</li>
                <li>• Implement features</li>
                <li>• Test and deploy</li>
              </ul>
            </div>

            <div className="card hover:scale-105 transition-transform duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🎨 UI Components Ready
              </h3>
              <div className="space-y-3">
                <button className="btn-mood w-full">
                  😊 Mood Button
                </button>
                <div className="breathing-circle mx-auto"></div>
                <p className="text-sm text-gray-500 text-center">
                  Breathing animation
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App