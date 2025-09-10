import { useState } from 'react';
import JsonDiff from "./components/JsonDiff/JsonDiff";
import JsonFormatter from "./components/JsonFormatter/JsonFormatter";
import './App.css';

function App() {
  const [activeTool, setActiveTool] = useState('diff');

  return (
    <div className="App">
      <header className="App-header">
        <h1>JSON Pro</h1>
        <nav>
          <button onClick={() => setActiveTool('diff')} className={activeTool === 'diff' ? 'active' : ''}>
            JSON Diff
          </button>
          <button onClick={() => setActiveTool('formatter')} className={activeTool === 'formatter' ? 'active' : ''}>
            JSON Formatter
          </button>
        </nav>
      </header>
      <main>
        {activeTool === 'diff' && <JsonDiff />}
        {activeTool === 'formatter' && <JsonFormatter />}
      </main>
    </div>
  );
}

export default App;