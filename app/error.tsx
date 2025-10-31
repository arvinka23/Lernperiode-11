'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ein Fehler ist aufgetreten</h1>
            <p className="text-gray-600 mb-4">
              Die App konnte nicht geladen werden. Bitte lade die Seite neu.
            </p>
            {this.state.error && (
              <details className="text-left text-sm text-gray-500 mb-4">
                <summary className="cursor-pointer mb-2">Fehlerdetails</summary>
                <pre className="bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

