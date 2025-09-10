import { useState, useMemo } from 'react'
import * as jsondiffpatch from 'jsondiffpatch'

const JsonDiffViewer = () => {
  const [leftJson, setLeftJson] = useState('')
  const [rightJson, setRightJson] = useState('')
  const [error, setError] = useState('')

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
      const left = JSON.parse(leftJson)
      const right = JSON.parse(rightJson)
      
      setError('')
      
      const delta = jsondiffpatch.diff(left, right)
      return { left, right, delta }
    } catch (err) {
      setError(`JSON Parse Error: ${err.message}`)
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
            className = isLeft ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            diffIndicator = isLeft ? '- ' : '+ '
          } else if (deltaValue.length === 2) {
            className = isLeft ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            diffIndicator = isLeft ? '- ' : '+ '
          } else if (deltaValue.length === 3 && deltaValue[2] === 0) {
            className = 'bg-red-100 text-red-800'
            diffIndicator = '- '
          }
        } else if (typeof deltaValue === 'object') {
          className = 'bg-yellow-100 text-yellow-800'
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
                  <span className="text-blue-600">"{key}"</span>: {renderValue(val, [...path, key])}
                </span>
              ))}
              {'}'}
            </span>
          )
        }
      } else if (typeof value === 'string') {
        return <span className={`text-green-600 ${className}`}>{diffIndicator}"{value}"</span>
      } else {
        return <span className={`text-purple-600 ${className}`}>{diffIndicator}{String(value)}</span>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JSON Diff Tool</h1>
          <p className="text-lg text-gray-600">Compare two JSON objects and visualize the differences</p>
          
          <div className="mt-4 space-x-4">
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load Example
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Original JSON (Left)
            </label>
            <textarea
              value={leftJson}
              onChange={(e) => setLeftJson(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your original JSON here..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Modified JSON (Right)
            </label>
            <textarea
              value={rightJson}
              onChange={(e) => setRightJson(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your modified JSON here..."
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Diff Result */}
        {parsedDiff && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Comparison Result</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Original */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Original (Removed/Changed)
                </h3>
                <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {parsedDiff.delta ? renderJsonWithDiff(parsedDiff.left, parsedDiff.delta, true) : JSON.stringify(parsedDiff.left, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Right Side - Modified */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Modified (Added/Changed)
                </h3>
                <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {parsedDiff.delta ? renderJsonWithDiff(parsedDiff.right, parsedDiff.delta, false) : JSON.stringify(parsedDiff.right, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-sm">Removed/Original values</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm">Added/New values</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-sm">Modified objects</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!parsedDiff && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600 mb-4">
                Paste your JSON objects in the text areas above to see a detailed comparison.
              </p>
              <p className="text-sm text-gray-500">
                Click "Load Example" to see the tool in action with sample data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JsonDiffViewer