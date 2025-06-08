import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

describe('Calculator component', () => {
  test('renders and displays initial 0', () => {
    render(<Calculator />);
    expect(screen.getByText('0')).toBeInTheDocument(); // Display
    // Check for a few key buttons
    expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
  });

  test('handles single digit number input', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  test('handles multiple digit number input', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '1' }));
    userEvent.click(screen.getByRole('button', { name: '2' }));
    userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  test('performs addition: 2 + 3 = 5', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '2' }));
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByText('2+3')).toBeInTheDocument(); // Check display during input
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('performs subtraction: 5 - 2 = 3', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '5' }));
    userEvent.click(screen.getByRole('button', { name: '-' }));
    userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('5-2')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('performs multiplication: 4 * 3 = 12', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '4' }));
    userEvent.click(screen.getByRole('button', { name: '*' }));
    userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByText('4*3')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('performs division: 8 / 2 = 4', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '8' }));
    userEvent.click(screen.getByRole('button', { name: '/' }));
    userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('8/2')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('handles division by zero and displays Error', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '5' }));
    userEvent.click(screen.getByRole('button', { name: '/' }));
    userEvent.click(screen.getByRole('button', { name: '0' }));
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  test('clears the display and resets state with C button', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '1' }));
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('1+2')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByText('0')).toBeInTheDocument();
    // Try a new calculation to ensure state was reset
    userEvent.click(screen.getByRole('button', { name: '7' }));
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '8' }));
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('handles decimal input: 1.2 + 3.4 = 4.6', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '1' }));
    userEvent.click(screen.getByRole('button', { name: '.' }));
    userEvent.click(screen.getByRole('button', { name: '2' })); // 1.2
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '3' }));
    userEvent.click(screen.getByRole('button', { name: '.' }));
    userEvent.click(screen.getByRole('button', { name: '4' })); // 3.4
    expect(screen.getByText('1.2+3.4')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  test('prevents multiple decimal points in one number', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '1' }));
    userEvent.click(screen.getByRole('button', { name: '.' }));
    userEvent.click(screen.getByRole('button', { name: '2' }));
    userEvent.click(screen.getByRole('button', { name: '.' })); // Second decimal
    userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByText('1.23')).toBeInTheDocument(); // Should ignore the second decimal
  });

  test('performs chained operations: 1 + 2 + 3 = 6', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '1' }));
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '2' })); // Display: 1+2
    userEvent.click(screen.getByRole('button', { name: '+' })); // Display: 3+ (1+2 is calculated and becomes previousOperand)
    // At this point, "1+2" (which is 3) is previousOperand, "+" is operator. Display shows "3+"
    expect(screen.getByText('3+')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '3' })); // Display: 3+3
    expect(screen.getByText('3+3')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' })); // Display: 6
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  test('continues calculation after equals: 2 * 3 = 6, then + 4 = 10', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '2' }));
    userEvent.click(screen.getByRole('button', { name: '*' }));
    userEvent.click(screen.getByRole('button', { name: '3' }));
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('6')).toBeInTheDocument(); // Result is 6

    userEvent.click(screen.getByRole('button', { name: '+' })); // Use result 6 for next operation
    expect(screen.getByText('6+')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '4' }));
    expect(screen.getByText('6+4')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('10')).toBeInTheDocument();
  });

   test('handles operator change: 5 + then click - then 2 = 3', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '5' }));
    userEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('5+')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '-' })); // Change operator
    expect(screen.getByText('5-')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('5-2')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('starts new calculation after a result if a number is pressed', () => {
    render(<Calculator />);
    userEvent.click(screen.getByRole('button', { name: '1' }));
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '2' }));
    userEvent.click(screen.getByRole('button', { name: '=' })); // Result is 3
    expect(screen.getByText('3')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: '4' })); // Pressing a number starts a new calculation
    expect(screen.getByText('4')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: '+' }));
    userEvent.click(screen.getByRole('button', { name: '5' }));
    userEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByText('9')).toBeInTheDocument();
  });

});
