# catch-monkey-app
For Catching Monkey and Apps

This project is a React-based application that initially started as a tool for decrypting specific string formats and has now been expanded to include additional utilities.

## Features

*   **Encryption/Decryption Tool:**
    *   Originally designed for decrypting "monkey strings," this tool now supports both AES-256 encryption and decryption of general text strings.
    *   It utilizes the `REACT_APP_MON_KEY` environment variable for the encryption/decryption key.
    *   Decrypted output can be displayed as a parsed JSON object (if applicable) or as a raw string.
*   **Simple Calculator:**
    *   A standard four-function (add, subtract, multiply, divide) calculator for performing quick arithmetic operations.
    *   Includes a display, number buttons (0-9, .), operator buttons, an equals button, and a clear button.
*   **Basic Calculation Tool:**
    *   Allows users to perform simple calculations (add, subtract, multiply, divide) on two numbers entered into input fields.
    *   Includes input validation to ensure numbers are entered and to prevent division by zero.

## Important: Encryption Key

The encryption and decryption functionalities rely on an environment variable named `REACT_APP_MON_KEY`. You **must** set this variable in your environment for these features to work correctly.

For local development, you can create a `.env` file in the root of your project and add the following line:
`REACT_APP_MON_KEY=your_secret_encryption_key_here`

Replace `your_secret_encryption_key_here` with a strong, unique key. **Do not commit your `.env` file to version control if it contains sensitive keys.**

For deployment (e.g., on GitHub Pages, Netlify, Vercel), you will need to configure this environment variable in your hosting provider's settings.

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
