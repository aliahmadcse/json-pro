import { useState, useEffect, useRef } from 'react';
import * as Diff from 'diff';
import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui';
import 'diff2html/bundles/css/diff2html.min.css';
import JsonInput from './JsonInput';
import './JsonDiff.css';

const JsonDiff = () => {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [error, setError] = useState('');
  const diffContainer = useRef(null);

  const handleFileUpload = (setter) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setter(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleCompare = () => {
    if (!leftJson || !rightJson) {
      setError('Please provide both JSON inputs.');
      return;
    }
    try {
        JSON.parse(leftJson);
        JSON.parse(rightJson);
        setError('');
        setShowDiff(true);
    } catch (e) {
        setError('Invalid JSON');
    }
  };

  useEffect(() => {
    if (showDiff && diffContainer.current) {
      const left = JSON.stringify(JSON.parse(leftJson), null, 2);
      const right = JSON.stringify(JSON.parse(rightJson), null, 2);
      const patch = Diff.createPatch('json', left, right);
      const diff2htmlUi = new Diff2HtmlUI(diffContainer.current, patch, {
        drawFileList: false,
        matching: 'lines',
        outputFormat: 'side-by-side',
      });
      diff2htmlUi.draw();
      diffContainer.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDiff, leftJson, rightJson]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            JSON Diff
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Compare two JSON objects and see the differences.
          </p>
        </div>

        {!showDiff ? (
          <div>
            <div className="diff-viewer">
              <JsonInput
                title="Original JSON"
                value={leftJson}
                onChange={(e) => setLeftJson(e.target.value)}
                onFileUpload={handleFileUpload(setLeftJson)}
                fileInputId="left-file"
              />
              <JsonInput
                title="Modified JSON"
                value={rightJson}
                onChange={(e) => setRightJson(e.target.value)}
                onFileUpload={handleFileUpload(setRightJson)}
                fileInputId="right-file"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={handleCompare} className="compare-button">
                Compare
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="diff-output" ref={diffContainer}></div>
            <div className="mt-4 flex justify-center">
              <button onClick={() => setShowDiff(false)} className="new-comparison-button">
                New Comparison
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonDiff;
