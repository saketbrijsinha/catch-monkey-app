import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { a256 } from './commonValue'; // Import the mocked function

// Mock commonValue.js
jest.mock('./commonValue', () => ({
  ...jest.requireActual('./commonValue'), // Import and retain other exports
  a256: jest.fn(), // Mock the a256 function
}));

describe('App component', () => {
  beforeEach(() => {
    // Reset mock before each test
    a256.mockClear();
    // Provide a default mock return value for a256 if needed for general cases,
    // specific tests can override this.
    // a256.mockReturnValue('{}'); // Default to empty JSON string for decryption
  });

  test('renders in Decrypt mode initially', () => {
    render(<App />);
    expect(screen.getByLabelText(/Decrypt/i)).toBeChecked();
    expect(screen.getByRole('button', { name: /Convert to App/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type here.../i)).toBeInTheDocument();
  });

  test('can switch to Encrypt mode and UI updates', () => {
    render(<App />);
    userEvent.click(screen.getByLabelText(/Encrypt/i));
    expect(screen.getByLabelText(/Encrypt/i)).toBeChecked();
    expect(screen.getByRole('button', { name: /Encrypt Data/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter data to encrypt.../i)).toBeInTheDocument();
  });

  test('can switch back to Decrypt mode from Encrypt mode', () => {
    render(<App />);
    userEvent.click(screen.getByLabelText(/Encrypt/i)); // Go to Encrypt
    userEvent.click(screen.getByLabelText(/Decrypt/i)); // Go back to Decrypt
    expect(screen.getByLabelText(/Decrypt/i)).toBeChecked();
    expect(screen.getByRole('button', { name: /Convert to App/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type here.../i)).toBeInTheDocument();
  });

  test('calls a256 with "dec" for decryption and displays JSON result', () => {
    // Mock a256 to return a JSON object for this specific test
    a256.mockReturnValue({ key: "value", nested: { num: 1 } });
    render(<App />);

    userEvent.type(screen.getByRole('textbox'), 'testinput');
    userEvent.click(screen.getByRole('button', { name: /Convert to App/i }));

    expect(a256).toHaveBeenCalledTimes(1);
    expect(a256).toHaveBeenCalledWith('testinput', 'dec');

    // Check for elements that would appear if JSON is rendered
    // This depends on how renderJson displays the data.
    // Assuming renderJson creates text like "key: value"
    expect(screen.getByText(/key:/i)).toBeInTheDocument();
    expect(screen.getByText(/value/i)).toBeInTheDocument();
    expect(screen.getByText(/nested:/i)).toBeInTheDocument();
    // Check for the button to expand/collapse nested object
    expect(screen.getByRole('button', {name: /Show nested/i})).toBeInTheDocument();
  });

  test('calls a256 with "dec" for decryption and displays string result if not JSON', () => {
    a256.mockReturnValue('This is a plain string'); // Mock a non-JSON string result
    render(<App />);
    userEvent.type(screen.getByRole('textbox'), 'testinput_string');
    userEvent.click(screen.getByRole('button', { name: /Convert to App/i }));

    expect(a256).toHaveBeenCalledWith('testinput_string', 'dec');
    expect(screen.getByText(/App value:/i)).toBeInTheDocument();
    expect(screen.getByText('This is a plain string')).toBeInTheDocument();
  });


  test('calls a256 with "enc" for encryption and displays encrypted string', () => {
    a256.mockReturnValue('encrypted_string_output'); // Mock encrypted string
    render(<App />);

    userEvent.click(screen.getByLabelText(/Encrypt/i)); // Switch to encrypt mode
    userEvent.type(screen.getByPlaceholderText(/Enter data to encrypt.../i), 'test_for_encryption');
    userEvent.click(screen.getByRole('button', { name: /Encrypt Data/i }));

    expect(a256).toHaveBeenCalledTimes(1);
    expect(a256).toHaveBeenCalledWith('test_for_encryption', 'enc');
    expect(screen.getByText(/Encrypted Output:/i)).toBeInTheDocument();
    expect(screen.getByText('encrypted_string_output')).toBeInTheDocument();
  });

  test('shows "Please input a value" if input is empty on button click', () => {
    render(<App />);
    // Test in Decrypt mode
    userEvent.click(screen.getByRole('button', { name: /Convert to App/i }));
    expect(screen.getByText('Please input a value')).toBeInTheDocument();
    expect(a256).not.toHaveBeenCalled();

    // Test in Encrypt mode
    userEvent.click(screen.getByLabelText(/Encrypt/i));
    userEvent.click(screen.getByRole('button', { name: /Encrypt Data/i }));
    expect(screen.getByText('Please input a value')).toBeInTheDocument();
    expect(a256).not.toHaveBeenCalled();
  });
});
