import { useState, useMemo } from 'react'
import * as jsondiffpatch from 'jsondiffpatch'
import Icon from './Icon'

const JsonDiffViewer = () => {
  const [leftJson, setLeftJson] = useState('')
  const [rightJson, setRightJson] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Example JSON for demonstration
  const exampleLeft = JSON.stringify({
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "hobbies": ["reading", "swimming"],
    "address": {
      "street": "123 Main St",
      "zipcode": "10001"
    }
  }, null, 2)

  const exampleRight = JSON.stringify({
    "name": "John Doe",
    "age": 31,
    "city": "San Francisco",
    "hobbies": ["reading", "swimming", "hiking"],
    "address": {
      "street": "456 Oak Ave",
      "zipcode": "94102"
    },
    "phone": "+1-555-0123"
  }, null, 2)

  const parsedDiff = useMemo(() => {
    if (!leftJson.trim() || !rightJson.trim()) return null
    
    try {
      setIsLoading(true)
      const left = JSON.parse(leftJson)
      const right = JSON.parse(rightJson)
      
      setError('')
      
      const delta = jsondiffpatch.diff(left, right)
      setTimeout(() => setIsLoading(false), 500) // Simulated loading for better UX
      return { left, right, delta }
    } catch (err) {
      setError(`JSON Parse Error: ${err.message}`)
      setIsLoading(false)
      return null
    }
  }, [leftJson, rightJson])

  const renderJsonWithDiff = (obj, delta, isLeft = true) => {
    const renderValue = (value, path = []) => {
      const deltaValue = path.reduce((d, key) => d?.[key], delta)
      
      let className = ''
      let diffIndicator = ''
      
      if (deltaValue !== undefined) {
        if (Array.isArray(deltaValue)) {
          if (deltaValue.length === 1) {
            className = isLeft ? 'diff-removed' : 'diff-added'
            diffIndicator = isLeft ? '- ' : '+ '
          } else if (deltaValue.length === 2) {
            className = isLeft ? 'diff-removed' : 'diff-added'
            diffIndicator = isLeft ? '- ' : '+ '
          } else if (deltaValue.length === 3 && deltaValue[2] === 0) {
            className = 'diff-removed'
            diffIndicator = '- '
          }
        } else if (typeof deltaValue === 'object') {
          className = 'diff-modified'
        }
      }

      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          return (
            <span className={className}>
              {diffIndicator}[
              {value.map((item, index) => (
                <span key={index}>
                  {index > 0 && ', '}
                  {renderValue(item, [...path, index])}
                </span>
              ))}
              ]
            </span>
          )
        } else {
          return (
            <span className={className}>
              {diffIndicator}{'{'}
              {Object.entries(value).map(([key, val], index) => (
                <span key={key}>
                  {index > 0 && ', '}
                  <span className="json-key">"{key}"</span>: {renderValue(val, [...path, key])}
                </span>
              ))}
              {'}'}
            </span>
          )
        }
      } else if (typeof value === 'string') {
        return <span className={`json-string ${className}`}>{diffIndicator}"{value}"</span>
      } else if (typeof value === 'number') {
        return <span className={`json-number ${className}`}>{diffIndicator}{String(value)}</span>
      } else if (typeof value === 'boolean') {
        return <span className={`json-boolean ${className}`}>{diffIndicator}{String(value)}</span>
      } else if (value === null) {
        return <span className={`json-null ${className}`}>{diffIndicator}null</span>
      } else {
        return <span className={`${className}`}>{diffIndicator}{String(value)}</span>
      }
    }

    return renderValue(obj)
  }

  const loadExample = () => {
    setLeftJson(exampleLeft)
    setRightJson(exampleRight)
  }

  const clearAll = () => {
    setLeftJson('')
    setRightJson('')
    setError('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatJson = (text, setter) => {
    try {
      const parsed = JSON.parse(text)
      setter(JSON.stringify(parsed, null, 2))
    } catch {
      // If invalid JSON, just keep the original text
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="inline-flex items-center mb-6">
              <div className="bg-white/20 backdrop-blur-lg rounded-full p-4 mr-4 animate-pulse-glow">
                <i className="fas fa-code text-4xl text-white"></i>
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  JSON Pro
                </h1>
                <div className="text-xl text-blue-100 font-light">
                  Professional JSON Diff Tool
                </div>
              </div>
            </div>
            
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Compare, analyze, and visualize differences between JSON objects with our beautiful, 
              feature-rich diff tool designed for developers and data professionals.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={loadExample}
                className="btn-gradient text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover-lift flex items-center gap-3 transition-all duration-300"
              >
                <i className="fas fa-play"></i>
                Load Example
              </button>
              <button
                onClick={clearAll}
                className="btn-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover-lift flex items-center gap-3 transition-all duration-300"
              >
                <i className="fas fa-eraser"></i>
                Clear All
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            {/* Left Input */}
            <div className="bg-gradient-card rounded-2xl shadow-2xl p-6 hover-lift glass">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-file-code text-red-500"></i>
                    Original JSON
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => formatJson(leftJson, setLeftJson)}
                    className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    title="Format JSON"
                  >
                    <i className="fas fa-magic"></i>
                  </button>
                  <button
                    onClick={() => copyToClipboard(leftJson)}
                    className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
                    title="Copy to clipboard"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <textarea
                value={leftJson}
                onChange={(e) => setLeftJson(e.target.value)}
                className="w-full h-80 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                placeholder="Paste your original JSON here..."
                spellCheck={false}
              />
            </div>
            
            {/* Right Input */}
            <div className="bg-gradient-card rounded-2xl shadow-2xl p-6 hover-lift glass">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-file-code text-green-500"></i>
                    Modified JSON
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => formatJson(rightJson, setRightJson)}
                    className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    title="Format JSON"
                  >
                    <i className="fas fa-magic"></i>
                  </button>
                  <button
                    onClick={() => copyToClipboard(rightJson)}
                    className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
                    title="Copy to clipboard"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <textarea
                value={rightJson}
                onChange={(e) => setRightJson(e.target.value)}
                className="w-full h-80 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                placeholder="Paste your modified JSON here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 animate-fadeInUp">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
                  <div>
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 animate-fadeInUp">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">Analyzing differences...</p>
            </div>
          )}

          {/* Diff Result */}
          {parsedDiff && !isLoading && (
            <div className="space-y-8 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                  <i className="fas fa-search text-blue-200"></i>
                  Comparison Results
                </h2>
                <p className="text-blue-100">Differences highlighted and color-coded for easy analysis</p>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Side - Original */}
                <div className="bg-gradient-card rounded-2xl shadow-2xl overflow-hidden hover-lift">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                      <i className="fas fa-minus-circle"></i>
                      Original (Removed/Changed)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="font-mono text-sm bg-gray-50 p-6 rounded-xl overflow-x-auto max-h-96 custom-scrollbar">
                      <pre className="whitespace-pre-wrap">
                        {parsedDiff.delta ? renderJsonWithDiff(parsedDiff.left, parsedDiff.delta, true) : JSON.stringify(parsedDiff.left, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Right Side - Modified */}
                <div className="bg-gradient-card rounded-2xl shadow-2xl overflow-hidden hover-lift">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                      <i className="fas fa-plus-circle"></i>
                      Modified (Added/Changed)
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="font-mono text-sm bg-gray-50 p-6 rounded-xl overflow-x-auto max-h-96 custom-scrollbar">
                      <pre className="whitespace-pre-wrap">
                        {parsedDiff.delta ? renderJsonWithDiff(parsedDiff.right, parsedDiff.delta, false) : JSON.stringify(parsedDiff.right, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="bg-gradient-card rounded-2xl shadow-2xl p-8 hover-lift">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <i className="fas fa-info-circle text-blue-600"></i>
                  Legend & Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                    <div className="w-6 h-6 bg-red-100 border-l-4 border-red-500 rounded flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-red-800">Removed</div>
                      <div className="text-sm text-red-600">Values present only in original</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors">
                    <div className="w-6 h-6 bg-green-100 border-l-4 border-green-500 rounded flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-green-800">Added</div>
                      <div className="text-sm text-green-600">New values in modified version</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors">
                    <div className="w-6 h-6 bg-yellow-100 border-l-4 border-yellow-500 rounded flex-shrink-0"></div>
                    <div>
                      <div className="font-semibold text-yellow-800">Modified</div>
                      <div className="text-sm text-yellow-600">Objects with nested changes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!parsedDiff && !error && !isLoading && (
            <div className="text-center py-16 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="mb-6">
                  <i className="fas fa-rocket text-6xl text-blue-200 animate-float"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Compare?</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Paste your JSON objects in the text areas above to see a detailed, 
                  beautifully formatted comparison with syntax highlighting.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-200">
                  <i className="fas fa-lightbulb"></i>
                  <span className="text-sm">
                    Pro tip: Click "Load Example" to see the tool in action
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-20 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center gap-6 mb-4">
                <a href="https://github.com/aliahmadcse/json-pro" target="_blank" rel="noopener noreferrer" 
                   className="text-white hover:text-blue-200 transition-colors text-2xl">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-white hover:text-blue-200 transition-colors text-2xl">
                  <i className="fas fa-star"></i>
                </a>
                <a href="#" className="text-white hover:text-blue-200 transition-colors text-2xl">
                  <i className="fas fa-share-alt"></i>
                </a>
              </div>
              <p className="text-blue-100 text-sm">
                Made with <i className="fas fa-heart text-red-400"></i> for developers worldwide
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default JsonDiffViewer