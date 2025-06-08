import React, { useState } from 'react';
import './Calculator.css'; // Or import '../App.css' if styles are there

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [currentOperand, setCurrentOperand] = useState('');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operator, setOperator] = useState(null); // Stores the selected arithmetic operator (+, -, *, /)

  // Appends the clicked number to the current operand and updates the display.
  // If the display currently shows "0", it's replaced by the number.
  // Handles decimal points, ensuring only one is added.
  const handleNumberClick = (number) => {
    if (number === '.' && currentOperand.includes('.')) return; // Prevent multiple decimal points

    // If an operator is set and displayValue shows previousOperand + operator, start new currentOperand
    if (operator && displayValue === previousOperand + operator) {
        setCurrentOperand(number);
        setDisplayValue(previousOperand + operator + number);
    } else {
        setCurrentOperand(prev => prev + number);
        // If display is "0" or an operator was just pressed (currentOperand was empty), start new display
        if (displayValue === '0' || (operator && currentOperand === '')) {
            setDisplayValue(number);
        } else if (operator && previousOperand && currentOperand !== '') {
             // If we are typing the second number after an operator
            setDisplayValue(previousOperand + operator + (currentOperand + number));
        }
        else {
            setDisplayValue(prev => prev + number);
        }
    }
  };

  // Handles operator clicks (+, -, *, /).
  // If there's a pending operation (previousOperand, currentOperand, and operator are set),
  // it calculates the result first before setting the new operator.
  // Moves currentOperand to previousOperand and clears currentOperand.
  const handleOperatorClick = (op) => {
    // If no numbers have been entered yet, do nothing or only set operator if desired
    if (currentOperand === '' && previousOperand === '') {
        // Optionally, allow setting operator if displayValue is '0' and user clicks operator first
        // For now, requires at least one number to be set as previousOperand or currentOperand
        return;
    }

    // Scenario: User types a number, then an operator, then another number, then another operator (e.g. 2+3-)
    if (currentOperand !== '' && previousOperand !== '' && operator) {
        const result = calculate(previousOperand, currentOperand, operator);
        const result = calculate(previousOperand, currentOperand, operator);
        if (result === 'Error') {
            setDisplayValue('Error');
            setCurrentOperand('');
            setPreviousOperand('');
            setOperator(null);
            return;
        }
        setDisplayValue(result + op);
        setPreviousOperand(result);
        setCurrentOperand('');
        setOperator(op);
        return;
    }

    // Scenario: User types a number, then an operator (e.g. 2+)
    // Or, user has a result from previous calculation, then an operator (e.g. after 2+3=5, user presses +)
    if (currentOperand !== '') {
        setPreviousOperand(currentOperand); // The number just typed becomes previousOperand
        setDisplayValue(currentOperand + op);
        setCurrentOperand('');
        setOperator(op);
    }
    // Scenario: User types a number, an operator, and then wants to change the operator (e.g. 2+ then clicks -)
    // Here, previousOperand is set, currentOperand is empty, and an operator is already active.
    else if (previousOperand !== '' && operator) {
        setOperator(op); // Update the operator
        setDisplayValue(previousOperand + op); // Update the display
    }
    // If only previousOperand is set (e.g. from a result) and no currentOperand, set operator
    else if (previousOperand !== '' && currentOperand === '') {
         setOperator(op);
         setDisplayValue(previousOperand + op);
    }
  };

  // Calculates the result when '=' is clicked.
  // Requires previousOperand, currentOperand, and an operator to be set.
  // Updates displayValue with the result and sets currentOperand to the result
  // for further calculations. Clears previousOperand and operator.
  const handleEqualsClick = () => {
    if (previousOperand && currentOperand && operator) {
      const result = calculate(previousOperand, currentOperand, operator);
      setDisplayValue(result);
      setCurrentOperand(result); // The result becomes the new currentOperand for chained operations
      setPreviousOperand('');    // Clear previousOperand
      setOperator(null);         // Clear the operator
    }
  };

  // Resets the calculator state to its initial values.
  const handleClearClick = () => {
    setDisplayValue('0');
    setCurrentOperand('');
    setPreviousOperand('');
    setOperator(null);         // Clear the operator
  };

  // Performs the arithmetic calculation based on the operator.
  // Converts operand strings to numbers before calculation.
  // Handles division by zero by returning "Error".
  const calculate = (num1Str, num2Str, op) => {
    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);

    if (isNaN(num1) || isNaN(num2)) return 'Error'; // Should not happen if inputs are controlled

    switch (op) {
      case '+':
        return (num1 + num2).toString();
      case '-':
        return (num1 - num2).toString();
      case '*':
        return (num1 * num2).toString();
      case '/':
        if (num2 === 0) {
          return 'Error'; // Handle division by zero
        }
        return (num1 / num2).toString();
      default:
        return num2Str; // Fallback, should ideally not be reached
    }
  };

  return (
    <div className="calculator card shadow-sm p-3">
      <div className="calculator-display form-control text-right mb-2" style={{height: 'auto', fontSize: '2em'}}>{displayValue}</div>
      <div className="calculator-keys">
        {/* Row 1 */}
        <div className="row g-1 mb-1">
          <div className="col-3"><button onClick={() => handleClearClick()} className="btn btn-danger w-100">C</button></div>
          <div className="col-3"><button onClick={() => handleOperatorClick('/')} className="btn btn-secondary w-100">/</button></div>
          <div className="col-3"><button onClick={() => handleOperatorClick('*')} className="btn btn-secondary w-100">*</button></div>
          <div className="col-3"><button onClick={() => handleOperatorClick('-')} className="btn btn-secondary w-100">-</button></div>
        </div>
        {/* Row 2 & 3 combined for layout */}
        <div className="row g-1 mb-1">
            <div className="col-9">
                <div className="row g-1 mb-1">
                    <div className="col-4"><button onClick={() => handleNumberClick('7')} className="btn btn-light w-100">7</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('8')} className="btn btn-light w-100">8</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('9')} className="btn btn-light w-100">9</button></div>
                </div>
                <div className="row g-1">
                    <div className="col-4"><button onClick={() => handleNumberClick('4')} className="btn btn-light w-100">4</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('5')} className="btn btn-light w-100">5</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('6')} className="btn btn-light w-100">6</button></div>
                </div>
            </div>
            <div className="col-3">
                <button onClick={() => handleOperatorClick('+')} className="btn btn-secondary w-100 h-100">+</button>
            </div>
        </div>
        {/* Row 4 & 5 combined for layout */}
        <div className="row g-1">
            <div className="col-9">
                <div className="row g-1 mb-1">
                    <div className="col-4"><button onClick={() => handleNumberClick('1')} className="btn btn-light w-100">1</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('2')} className="btn btn-light w-100">2</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('3')} className="btn btn-light w-100">3</button></div>
                </div>
                <div className="row g-1">
                    <div className="col-8"><button onClick={() => handleNumberClick('0')} className="btn btn-light w-100">0</button></div>
                    <div className="col-4"><button onClick={() => handleNumberClick('.')} className="btn btn-light w-100">.</button></div>
                </div>
            </div>
            <div className="col-3">
                <button onClick={() => handleEqualsClick()} className="btn btn-primary w-100 h-100">=</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
