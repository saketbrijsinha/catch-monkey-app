import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomLogic from './CustomLogic';

describe('CustomLogic component', () => {
  test('renders with initial fields and default operation (Add)', () => {
    render(<CustomLogic />);
    expect(screen.getByLabelText(/Number 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number 1/i)).toHaveValue(null); // Input type number is weird with value
    expect(screen.getByLabelText(/Number 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number 2/i)).toHaveValue(null);

    const operationSelect = screen.getByLabelText(/Operation/i);
    expect(operationSelect).toBeInTheDocument();
    expect(operationSelect).toHaveValue('add'); // Default operation

    expect(screen.getByRole('button', { name: /Calculate/i })).toBeInTheDocument();
  });

  test('allows typing into number fields', () => {
    render(<CustomLogic />);
    const num1Input = screen.getByLabelText(/Number 1/i);
    const num2Input = screen.getByLabelText(/Number 2/i);

    userEvent.type(num1Input, '123');
    userEvent.type(num2Input, '456');

    expect(num1Input).toHaveValue(123); // number inputs convert string "123" to number 123
    expect(num2Input).toHaveValue(456);
  });

  test('allows changing the operation', () => {
    render(<CustomLogic />);
    const operationSelect = screen.getByLabelText(/Operation/i);
    userEvent.selectOptions(operationSelect, 'subtract');
    expect(operationSelect).toHaveValue('subtract');

    userEvent.selectOptions(operationSelect, 'multiply');
    expect(operationSelect).toHaveValue('multiply');

    userEvent.selectOptions(operationSelect, 'divide');
    expect(operationSelect).toHaveValue('divide');
  });

  test('performs addition: 10 + 5 = 15', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '10');
    userEvent.type(screen.getByLabelText(/Number 2/i), '5');
    // Default operation is add
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Result: 15')).toBeInTheDocument();
  });

  test('performs subtraction: 20 - 5 = 15', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '20');
    userEvent.type(screen.getByLabelText(/Number 2/i), '5');
    userEvent.selectOptions(screen.getByLabelText(/Operation/i), 'subtract');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Result: 15')).toBeInTheDocument();
  });

  test('performs multiplication: 7 * 3 = 21', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '7');
    userEvent.type(screen.getByLabelText(/Number 2/i), '3');
    userEvent.selectOptions(screen.getByLabelText(/Operation/i), 'multiply');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Result: 21')).toBeInTheDocument();
  });

  test('performs division: 20 / 4 = 5', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '20');
    userEvent.type(screen.getByLabelText(/Number 2/i), '4');
    userEvent.selectOptions(screen.getByLabelText(/Operation/i), 'divide');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Result: 5')).toBeInTheDocument();
  });

  test('handles division by zero and shows error', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '10');
    userEvent.type(screen.getByLabelText(/Number 2/i), '0');
    userEvent.selectOptions(screen.getByLabelText(/Operation/i), 'divide');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Cannot divide by zero.')).toBeInTheDocument();
    expect(screen.queryByText(/Result:/i)).not.toBeInTheDocument(); // No result should be shown
  });

  test('handles non-numeric input in Number 1 and shows error', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), 'abc');
    userEvent.type(screen.getByLabelText(/Number 2/i), '5');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Please enter valid numbers in both fields.')).toBeInTheDocument();
    expect(screen.queryByText(/Result:/i)).not.toBeInTheDocument();
  });

  test('handles non-numeric input in Number 2 and shows error', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '5');
    userEvent.type(screen.getByLabelText(/Number 2/i), 'xyz');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Please enter valid numbers in both fields.')).toBeInTheDocument();
    expect(screen.queryByText(/Result:/i)).not.toBeInTheDocument();
  });

  test('handles empty input in Number 1 and shows error', () => {
    render(<CustomLogic />);
    // num1 is left empty
    userEvent.type(screen.getByLabelText(/Number 2/i), '5');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Please enter valid numbers in both fields.')).toBeInTheDocument();
  });

  test('handles empty input in Number 2 and shows error', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '5');
    // num2 is left empty
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Please enter valid numbers in both fields.')).toBeInTheDocument();
  });

  test('clears previous error when a valid calculation is made', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), 'abc'); // Invalid input first
    userEvent.type(screen.getByLabelText(/Number 2/i), '5');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Please enter valid numbers in both fields.')).toBeInTheDocument();

    // Now enter valid numbers
    userEvent.clear(screen.getByLabelText(/Number 1/i));
    userEvent.type(screen.getByLabelText(/Number 1/i), '10');
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.queryByText('Please enter valid numbers in both fields.')).not.toBeInTheDocument();
    expect(screen.getByText('Result: 15')).toBeInTheDocument(); // 10 + 5 (default op)
  });

  test('clears previous result when a new calculation is made', () => {
    render(<CustomLogic />);
    userEvent.type(screen.getByLabelText(/Number 1/i), '10');
    userEvent.type(screen.getByLabelText(/Number 2/i), '2');
    userEvent.selectOptions(screen.getByLabelText(/Operation/i), 'multiply'); // 10 * 2 = 20
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.getByText('Result: 20')).toBeInTheDocument();

    // New calculation
    userEvent.clear(screen.getByLabelText(/Number 1/i));
    userEvent.type(screen.getByLabelText(/Number 1/i), '5');
    userEvent.clear(screen.getByLabelText(/Number 2/i));
    userEvent.type(screen.getByLabelText(/Number 2/i), '3');
    userEvent.selectOptions(screen.getByLabelText(/Operation/i), 'add'); // 5 + 3 = 8
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(screen.queryByText('Result: 20')).not.toBeInTheDocument();
    expect(screen.getByText('Result: 8')).toBeInTheDocument();
  });
});
