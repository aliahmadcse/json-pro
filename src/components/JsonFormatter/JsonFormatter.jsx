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
    <div className="formatter-container">
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here"
        className="json-input"
      />
      <button onClick={handleFormat} className="format-button">
        Format
      </button>
      {error && <div className="error-message">{error}</div>}
      <pre className="formatted-json">{formattedJson}</pre>
    </div>
  );
};

export default JsonFormatter;
