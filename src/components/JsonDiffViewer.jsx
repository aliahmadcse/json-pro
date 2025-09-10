import { useState, useMemo } from 'react'
import * as jsondiffpatch from 'jsondiffpatch'
import Icon from './Icon'

const JsonDiffViewer = () => {
  const [leftJson, setLeftJson] = useState('')
  const [rightJson, setRightJson] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

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
    if (!showComparison || !leftJson.trim() || !rightJson.trim()) return null
    
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
  }, [leftJson, rightJson, showComparison])

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
    setShowComparison(false)
  }

  const clearAll = () => {
    setLeftJson('')
    setRightJson('')
    setError('')
    setShowComparison(false)
  }

  const handleCompare = () => {
    if (!leftJson.trim() || !rightJson.trim()) {
      setError('Please enter JSON content in both text areas')
      return
    }
    setShowComparison(true)
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-4">
            <div className="bg-blue-600 rounded-lg p-3 mr-4">
              <i className="fas fa-code text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                JSON Pro
              </h1>
              <div className="text-lg text-gray-600">
                Professional JSON Diff Tool
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Compare, analyze, and visualize differences between JSON objects with our clean and simple diff tool.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={loadExample}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <i className="fas fa-play"></i>
              Load Example
            </button>
            <button
              onClick={clearAll}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <i className="fas fa-eraser"></i>
              Clear All
            </button>
          </div>
        </div>

        {/* Input Section - Only show when not in comparison mode */}
        {!showComparison && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                    Original JSON
                  </label>
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
                  className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                  placeholder="Paste your original JSON here..."
                  spellCheck={false}
                />
              </div>
              
              {/* Right Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    Modified JSON
                  </label>
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
                  className="w-full h-80 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                  placeholder="Paste your modified JSON here..."
                  spellCheck={false}
                />
              </div>
            </div>
            
            {/* Compare Button */}
            <div className="text-center">
              <button
                onClick={handleCompare}
                disabled={!leftJson.trim() || !rightJson.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 mx-auto"
              >
                <i className="fas fa-search"></i>
                Compare JSON
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-lg mr-3"></i>
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
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Analyzing differences...</p>
          </div>
        )}

        {/* Comparison Results - Only show when in comparison mode */}
        {showComparison && parsedDiff && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <i className="fas fa-search text-blue-600"></i>
                Comparison Results
              </h2>
              <button
                onClick={() => setShowComparison(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i>
                Back to Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Side - Original */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-500 p-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <i className="fas fa-minus-circle"></i>
                    Original (Removed/Changed)
                  </h3>
                </div>
                <div className="p-4">
                  <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 custom-scrollbar">
                    <pre className="whitespace-pre-wrap">
                      {parsedDiff.delta ? renderJsonWithDiff(parsedDiff.left, parsedDiff.delta, true) : JSON.stringify(parsedDiff.left, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Right Side - Modified */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-green-500 p-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <i className="fas fa-plus-circle"></i>
                    Modified (Added/Changed)
                  </h3>
                </div>
                <div className="p-4">
                  <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 custom-scrollbar">
                    <pre className="whitespace-pre-wrap">
                      {parsedDiff.delta ? renderJsonWithDiff(parsedDiff.right, parsedDiff.delta, false) : JSON.stringify(parsedDiff.right, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-600"></i>
                Legend
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded"></div>
                  <div>
                    <div className="font-semibold text-red-800">Removed</div>
                    <div className="text-sm text-red-600">Only in original</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
                  <div>
                    <div className="font-semibold text-green-800">Added</div>
                    <div className="text-sm text-green-600">New in modified</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500 rounded"></div>
                  <div>
                    <div className="font-semibold text-yellow-800">Modified</div>
                    <div className="text-sm text-yellow-600">Changed values</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions - Only show when not in comparison mode and no content */}
        {!showComparison && !parsedDiff && !error && !isLoading && (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <i className="fas fa-rocket text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Compare?</h3>
              <p className="text-gray-600 mb-6">
                Paste your JSON objects in the text areas above and click "Compare JSON" to see a detailed comparison.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <i className="fas fa-lightbulb"></i>
                <span className="text-sm">
                  Pro tip: Click "Load Example" to see the tool in action
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center gap-6 mb-4">
              <a href="https://github.com/aliahmadcse/json-pro" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-600 hover:text-blue-600 transition-colors text-xl">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-xl">
                <i className="fas fa-star"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-xl">
                <i className="fas fa-share-alt"></i>
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              Made with <i className="fas fa-heart text-red-400"></i> for developers worldwide
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default JsonDiffViewer