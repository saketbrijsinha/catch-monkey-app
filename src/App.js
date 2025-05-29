import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { a256 } from "./commonValue";

import "./App.css";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [outputJson, setOutputJson] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState({});

  const handleToggle = (key) => {
    setExpandedKeys((prevExpandedKeys) => ({
      ...prevExpandedKeys,
      [key]: !prevExpandedKeys[key],
    }));
  };

  const renderJson = (obj, parentKey = "") => {
    return Object.keys(obj).map((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const isExpanded = expandedKeys[fullKey];
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        return (
          <div key={fullKey} style={{ marginLeft: "20px" }}>
            <button
              className="btn btn-sm btn-outline-primary mb-1"
              onClick={() => handleToggle(fullKey)}
            >
              {isExpanded ? `Hide ${key}` : `Show ${key}`}
            </button>
            {isExpanded && <div>{renderJson(value, fullKey)}</div>}
          </div>
        );
      } else {
        return (
          <div key={fullKey} style={{ marginLeft: "20px" }}>
            <strong>{key}:</strong> {value}
          </div>
        );
      }
    });
  };

  const handleButtonClick = () => {
    const output = inputValue
      ? JSON.stringify(a256(inputValue, "dec"), null, 2)
      : "Please input a value";
    try {
      const parsedJson = JSON.parse(output);
      if (typeof parsedJson === "object") {
        setOutputJson(parsedJson);
        setOutputValue("");
      } else {
        setOutputJson(null);
        setOutputValue(output + "");
      }
    } catch (error) {
      setOutputJson(null);
      setOutputValue(output + "");
    }
  };

  const handleDownloadJson = () => {
    if (!outputJson) return;
    const blob = new Blob([JSON.stringify(outputJson, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "decrypted_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4">Catch Monkey</h2>
        <div className="form-group mb-3">
          <label htmlFor="inputField" className="form-label">
            Enter Monkey string (without quotes):
          </label>
          <input
            type="text"
            id="inputField"
            className="form-control"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type here..."
          />
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleButtonClick}
          >
            Convert to App
          </button>
        </div>
        {outputJson ? (
          <>
            <div className="output-box mt-4">
              <h4 className="output-label">Output App JSON:</h4>
              <pre className="output-value">{renderJson(outputJson)}</pre>
            </div>
            <div className="output-box mt-4">
              <h4 className="output-label">Output Stringified App JSON:</h4>
              <pre className="output-value">
                {JSON.stringify(outputJson, null, 2)}
              </pre>
            </div>
            <button className="download-button" onClick={handleDownloadJson}>
              <FaDownload size={40} />
            </button>
          </>
        ) : outputValue ? (
          <div className="output-box mt-4 text-center">
            <h4 className="output-label">App value:</h4>
            <p className="output-value">{outputValue}</p>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default App;
