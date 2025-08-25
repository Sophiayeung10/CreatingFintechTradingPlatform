Project Overview

This project is a full-stack WebAuthn authentication demo with React frontend and Node.js/Express backend. It provides fingerprint/TouchID login and registration flows, along with an onboarding page for user interaction.

📂 Project Structure
Frontend (/src)

/src/fingerprint.js
Handles fingerprint/TouchID authentication logic using WebAuthn APIs. It manages the flow for starting and verifying login/registration with the browser’s navigator.credentials API.

/src/base64Utils.js
Utility functions to encode/decode base64url data into ArrayBuffer format, which is required for WebAuthn challenge and credential handling.

/src/Group.png
Static image asset, likely used in the UI.

/src/onboarding-bg.png
Background image for the onboarding screen.

/src/App.css
Global CSS styles for the React application.

/src/index.css
Root-level CSS file applied to the main React entry point. It often contains reset or base styles.

/src/OnboardingPage.jsx
Main onboarding page React component. It renders the UI for signing up/logging in with TouchID, Google, Apple, or Twitter. It integrates with fingerprint.js for biometric authentication.

/src/OnboardingPage.css
Styling for the onboarding page component (OnboardingPage.jsx).

/src/App.jsx
Root React component that sets up routing and page structure. It serves as the main container for all frontend views.

/src/main.jsx
React entry point. It renders <App /> into the DOM and sets up React's root.

Backend (/backend)

/backend/authRoutes.js
Express router handling WebAuthn authentication and registration routes.

/challenge – Issues a challenge for authentication.

/verify – Verifies authentication responses.

/register-options – Issues registration options.

/register – Verifies registration responses.

/backend/server.js
Main backend Express server file. It sets up middleware, loads routes (authRoutes.js), and listens on a specified port.

/backend/package.json
Defines backend dependencies (e.g., express, @simplewebauthn/server), scripts, and project metadata.

🚀 How It Works

Frontend (React):

User clicks "Login with TouchID" on OnboardingPage.jsx.

fingerprint.js uses WebAuthn API to request credentials.

Data is sent to backend routes for verification.

Backend (Node.js + Express):

Issues WebAuthn challenges (via authRoutes.js).

Validates user registration/authentication using @simplewebauthn/server.

Responds with success/failure back to frontend.

Utilities:

base64Utils.js ensures correct handling of challenge/credential binary formats.
