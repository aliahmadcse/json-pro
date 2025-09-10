import { useState } from 'react';

const JsonFormatter = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setError('');
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setError('Invalid JSON');
      setFormattedJson('');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4 py-8">
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here"
        className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-y"
      />
      <button onClick={handleFormat} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md">
        Format
      </button>
      {error && <div className="text-red-500 font-medium">{error}</div>}
      <pre className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-auto text-left font-mono text-gray-800 whitespace-pre-wrap">
        {formattedJson}
      </pre>
    </div>
  );
};

export default JsonFormatter;
