import React, { useState } from 'react';

const CustomLogic = () => {
  // State for the first number input
  const [num1, setNum1] = useState('');
  // State for the second number input
  const [num2, setNum2] = useState('');
  // State for the selected operation (add, subtract, multiply, divide)
  const [operation, setOperation] = useState('add');
  // State for storing the calculation result
  const [result, setResult] = useState('');
  // State for storing any error messages
  const [error, setError] = useState('');

  // Handles the calculation logic when the "Calculate" button is clicked.
  const handleCalculate = () => {
    // Clear previous errors and results
    setError('');
    setResult('');

    // Parse input strings to floating-point numbers
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    // Validate that both inputs are valid numbers
    if (isNaN(n1) || isNaN(n2)) {
      setError('Please enter valid numbers in both fields.');
      return;
    }

    let calcResult;
    // Perform calculation based on the selected operation
    switch (operation) {
      case 'add':
        calcResult = n1 + n2;
        break;
      case 'subtract':
        calcResult = n1 - n2;
        break;
      case 'multiply':
        calcResult = n1 * n2;
        break;
      case 'divide':
        // Handle division by zero
        if (n2 === 0) {
          setError('Cannot divide by zero.');
          return;
        }
        calcResult = n1 / n2;
        break;
      default:
        // Handle invalid operation selection (should not happen with select dropdown)
        setError('Invalid operation selected.');
        return;
    }
    // Set the result, prefixed with "Result: "
    setResult(`Result: ${calcResult}`);
  };

  return (
    <div className="custom-logic card shadow-sm p-3">
      <h4 className="text-center mb-3">Basic Calculations</h4>
      <div className="mb-3">
        <label htmlFor="num1" className="form-label">Number 1:</label>
        <input
          type="number"
          className="form-control"
          id="num1"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter first number"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="num2" className="form-label">Number 2:</label>
        <input
          type="number"
          className="form-control"
          id="num2"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter second number"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="operation" className="form-label">Operation:</label>
        <select
          className="form-select"
          id="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (-)</option>
          <option value="multiply">Multiply (*)</option>
          <option value="divide">Divide (/)</option>
        </select>
      </div>
      <button onClick={handleCalculate} className="btn btn-info w-100 mb-3">
        Calculate
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {result && <div className="alert alert-success mt-3">{result}</div>}
      <p className="mt-3 text-muted small">
        This is a basic calculation tool. More complex custom logic (like policy premium calculations) would require specific pre-defined formulas.
      </p>
    </div>
  );
};

export default CustomLogic;
