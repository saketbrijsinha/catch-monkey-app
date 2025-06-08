import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { a256 } from "./commonValue";
import Calculator from './Calculator'; // Import Calculator component
import CustomLogic from './CustomLogic'; // Import CustomLogic component

import "./App.css";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [outputJson, setOutputJson] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState({});
  // operationMode: 'enc' for encryption, 'dec' for decryption. Determines if the input string is to be encrypted or decrypted.
  const [operationMode, setOperationMode] = useState("dec");

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
    if (!inputValue) {
      setOutputValue("Please input a value");
      setOutputJson(null);
      return;
    }

    // Handle encryption mode
    if (operationMode === "enc") {
      const encryptedOutput = a256(inputValue, "enc");
      setOutputValue(encryptedOutput); // Display the encrypted string
      setOutputJson(null); // Clear any JSON output
    }
    // Handle decryption mode
    else { // operationMode === "dec"
      const decryptedOutput = a256(inputValue, "dec");
      // The a256 function for 'dec' is expected to return a parsed JSON object if decryption
      // and parsing are successful. Otherwise, it returns a string (e.g., non-JSON data,
      // or an error message if decryption failed).

      if (typeof decryptedOutput === "object" && decryptedOutput !== null) {
        // If a256 returned an object, it's likely the successfully decrypted and parsed JSON.
        setOutputJson(decryptedOutput);
        setOutputValue("");
      } else if (typeof decryptedOutput === 'string') {
        // If a256 returned a string, it might be:
        // 1. Decrypted non-JSON data.
        // 2. A JSON string that a256 didn't parse (less likely with current a256 logic but good to handle).
        // 3. An error message from a256 itself.
        try {
          // Attempt to parse the string as JSON.
          const parsedJson = JSON.parse(decryptedOutput);
          // Check if parsing was successful and resulted in an object.
          if (typeof parsedJson === "object" && parsedJson !== null) {
            setOutputJson(parsedJson);
            setOutputValue("");
          } else {
            // If parsing resulted in a non-object (e.g. "true", "null", or a number string like "123"),
            // or if decryptedOutput was not valid JSON, display as plain text.
            setOutputJson(null);
            setOutputValue(decryptedOutput);
          }
        } catch (error) {
          // If JSON.parse fails, the string is not valid JSON. Display it as plain text.
          // This also covers cases where decryptedOutput was an error message from a256.
          setOutputJson(null);
          setOutputValue(decryptedOutput || "Decryption error or invalid format");
        }
      } else {
        // Fallback for unexpected decryptedOutput types (e.g. null, undefined but not an object)
        setOutputJson(null);
        setOutputValue("Unexpected decryption result format.");
      }
    }
  };

  const handleDownloadJson = () => {
    if (!outputJson) return; // Only allow download if outputJson is present
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
      {/* Existing card for Catch Monkey App */}
      <div className="card shadow-lg p-4 rounded mb-4"> {/* Added mb-4 for spacing */}
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
            placeholder={operationMode === "enc" ? "Enter data to encrypt..." : "Type here..."}
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Operation:</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="operationMode"
                id="decryptMode"
                value="dec"
                checked={operationMode === "dec"}
                onChange={(e) => setOperationMode(e.target.value)}
              />
              <label className="form-check-label" htmlFor="decryptMode">
                Decrypt
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="operationMode"
                id="encryptMode"
                value="enc"
                checked={operationMode === "enc"}
                onChange={(e) => setOperationMode(e.target.value)}
              />
              <label className="form-check-label" htmlFor="encryptMode">
                Encrypt
              </label>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleButtonClick}
          >
            {operationMode === "enc" ? "Encrypt Data" : "Convert to App"}
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
            {/* Only show download button if outputJson is present */}
            {outputJson && (
              <button className="download-button" onClick={handleDownloadJson}>
                <FaDownload size={40} />
              </button>
            )}
          </>
        ) : outputValue ? (
          <div className="output-box mt-4 text-center">
            <h4>{operationMode === "enc" ? "Encrypted Output:" : "App value:"}</h4>
            <p className="output-value">{outputValue}</p>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Section for the Calculator */}
      <div className="card shadow-lg p-4 rounded mb-4"> {/* Added mb-4 for spacing */}
        <h3 className="text-center mb-3">Simple Calculator</h3>
        <Calculator />
      </div>

      {/* New section for Custom Logic */}
      <div className="card shadow-lg p-4 rounded mt-4"> {/* mt-4 is fine here, or mb-4 on the one above */}
        {/* The CustomLogic component already includes a title, so we might not need a separate one here unless desired for consistency */}
        {/* For now, let's assume CustomLogic's internal title is sufficient */}
        <CustomLogic />
      </div>
    </div>
  );
};

export default App;
