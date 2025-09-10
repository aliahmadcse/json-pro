import Icon from '../Icon/Icon';
import './JsonInput.css';

const JsonInput = ({ title, value, onChange, onFileUpload, fileInputId }) => {
  return (
    <div className="json-input-container">
      <div className="json-input-header">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <input
          type="file"
          onChange={onFileUpload}
          className="hidden"
          id={fileInputId}
        />
        <label htmlFor={fileInputId} className="upload-button">
          <Icon name="upload" />
          Upload file
        </label>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Paste your JSON here"
      />
    </div>
  );
};

export default JsonInput;
