import React, { useEffect, useState } from "react";
import "./OnboardingPage.css";
import bgImage from "./onboarding-bg.png";
import bg from "./Group.png";
import { handleFingerprintLogin } from './fingerprint.js';
import { useNavigate } from 'react-router-dom';
import { base64UrlToUint8Array, arrayBufferToBase64 } from './base64Utils';



const OnboardingPage = () => {
  //navigate to new pages
  const navigate = useNavigate();

  //handleFingerprint goes to fingerprint.js
  

    // Registration flow using WebAuthn credential creation
    const handleRegistration = async () => {
      try {
        console.log("🆕 Starting registration...");

        // Check if WebAuthn is supported
        if (!window.PublicKeyCredential) {
          throw new Error("Your browser does not support WebAuthn/Touch ID.");
        }

        // Check if the device supports Touch ID/Face ID
        if (!window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
          throw new Error("Touch ID/Face ID is not available on this device.");
        }

        const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!isAvailable) {
          throw new Error("Touch ID/Face ID is not available on this device.");
        }

        // Fetch registration options from backend
        const regOptionsRes = await fetch("http://localhost:5001/api/auth/register-options", {
          credentials: "include",
        });

        if (!regOptionsRes.ok) {
          const errorData = await regOptionsRes.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to get registration options.");
        }

        const regOptions = await regOptionsRes.json();
        console.log("Registration options received:", regOptions);

        // Check if we have the required fields
        if (!regOptions.challenge) {
          throw new Error("Registration options missing challenge");
        }
        if (!regOptions.user || !regOptions.user.id) {
          throw new Error("Registration options missing user ID");
        }

        // Decode challenge and user id for WebAuthn API
        regOptions.challenge = base64UrlToUint8Array(regOptions.challenge);
        regOptions.user.id = base64UrlToUint8Array(regOptions.user.id);

        console.log("Calling WebAuthn create...");
        // Call WebAuthn to create new credential
        const credential = await navigator.credentials.create({ publicKey: regOptions });
        console.log("Credential created:", credential);

        // Send credential to backend to verify and register
        const registerRes = await fetch("http://localhost:5001/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: credential.id,
            rawId: arrayBufferToBase64(credential.rawId),
            response: {
              attestationObject: arrayBufferToBase64(credential.response.attestationObject),
              clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
            },
            type: credential.type,
          }),
        });

        if (!registerRes.ok) {
          const errorData = await registerRes.json().catch(() => ({}));
          throw new Error(errorData.message || "Registration failed.");
        }

        const registerResult = await registerRes.json();

        if (registerResult.success) {
          alert("✅ Touch ID registration successful!");
        } else {
          throw new Error(registerResult.message || "Registration verification failed.");
        }
      } catch (regErr) {
        console.error("Registration error:", regErr);
        alert(`❌ Touch ID registration failed.\nError: ${regErr.message || "Unknown error"}`);
      }
    };

    

  useEffect(() => {
    const appleLoginBtn = document.querySelector(".apple-login");
    const appleSignupBtn = document.querySelector(".apple");
    
    if (!appleLoginBtn && !appleSignupBtn) return;


    // Attach event listeners
    if (appleLoginBtn) {
      appleLoginBtn.addEventListener("click", handleFingerprintLogin);
    }
    
    if (appleSignupBtn) {
      appleSignupBtn.addEventListener("click", handleRegistration);
    }

    // Remove event listeners on unmount
    return () => {
      if (appleLoginBtn) {
        appleLoginBtn.removeEventListener("click", handleFingerprintLogin);
      }
      if (appleSignupBtn) {
        appleSignupBtn.removeEventListener("click", handleRegistration);
      }
    };
  }, []);

      //handle login
      //add PIN and fingerprint to relogin
      const [pin, setPin] = useState("");
      const [failedAttempts, setFailedAttempts] = useState(0);
      const [isLocked, setIsLocked] = useState(false);
      //it coulld be changed the state by using setShowLoginForm 
      const [showLoginForm] = useState(false); 

      const [reactivationStep, setReactivationStep] = useState(false);

      //email and phone
      
      const [email, setEmail] = useState("");
      const [phone, setPhone] = useState("");

      const [reactivationPin, setReactivationPin] = useState("");
      const [generatedPin, setGeneratedPin] = useState(""); // simulate server-sent PIN

      const handleLogin = async () => {
        if (isLocked) return;

        try {
          // Login using PIN
          const result = await fetch("/api/auth/login-pin", {
            method: "POST",
            body: JSON.stringify({ pin }),
            headers: { "Content-Type": "application/json" },
          });

          if (!result.ok) throw new Error("PIN failed");

          alert("Login Successfully!");
          setFailedAttempts(0);
        } catch (err) {
          console.error(err);
          const newAttempts = failedAttempts + 1;
          setFailedAttempts(newAttempts);
          if (newAttempts >= 3) {
            setIsLocked(true);
            setReactivationStep(true); // move to reactivation process
          } else {
            alert(`Login failed. You have ${3 - newAttempts} attempts left. Sorry~`);
          }
        }
      };

        //Steps to unlock
        //Step 1: submits email or phone
        const handleSendReactivationPin = () => {
          const identifier = email || phone;
          if (!identifier) {
            alert("Please enter your email or phone number.");
          return;
        }

        const generated = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
        setGeneratedPin(generated);
        alert(`Reactivation PIN sent to ${identifier}: ${generated} (simulated)`); // simulate email/SMS
      };
      //Step 2: submits reactivation PIN
      const handleVerifyReactivationPin = () => {
        if (reactivationPin === generatedPin) {
          alert("Account unlocked! Please try logging in again.");
          setFailedAttempts(0);
          setIsLocked(false);
          setReactivationStep(false);
          setPin("");
          setReactivationPin("");
        } else {
          alert("Incorrect reactivation PIN. Please try again.");
        }
      };


  return (
    <div className="onboarding-container">
      <div className="left-panel">
        <img src={bgImage} alt="Trading UI Design" className="bg-image" />
      </div>

      <div className="right-panel" style={{ backgroundImage: `url(${bg})` }}>
        <h1>Hello! Let's Swing In</h1>
        <p>Unlock smarter tools for better trading decisions.</p>

        <button className="social-btn google">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px", width: "20px", height: "20px" }}
          >
            <title>Google</title>
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Sign up with Google
        </button>

        <button className="social-btn apple">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px", width: "20px", height: "20px" }}
          >
            <title>Apple</title>
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
          </svg>
          Sign up with Apple ID
        </button>

        <button className="social-btn twitter">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px", width: "20px", height: "20px" }}
          >
            <title>X</title>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
          Sign up with X
        </button>

        <div className="divider">OR</div>
        <button className="signup-btn">Sign up with phone or email</button>

        <p className="terms">
          By signing up, you agree to the <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>, including <a href="#">cookie use</a>.
        </p>

        <p>Already have an account?</p>
        <div>
      {!showLoginForm ? (
        <button onClick={() => navigate("/relogin")} className="login-button">
          Log in
        </button>
      ) : isLocked && reactivationStep ? (
        // showLogForm to true and goes to email/phone
        <div>
          <h4>Account Locked</h4>
          <p>Please enter your email or phone number to receive a reactivation code.</p>
          <input
            className="email-input"
            type="text"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="phone-input"
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="sendCode" onClick={handleSendReactivationPin}>Send Code</button>

          <input
            className="reactive-input"
            type="text"
            placeholder="Enter reactivation PIN"
            value={reactivationPin}
            onChange={(e) => setReactivationPin(e.target.value)}
          />
          <button className="unlock-input" onClick={handleVerifyReactivationPin}>Unlock</button>
        </div>
      ) : (
        // 🟢 Normal login form
        <div>
          <label>
            <input
              type="checkbox"
              onChange={() => handleFingerprintLogin(handleRegistration)}
            />
            Use Touch ID
          </label>

          <input
              className="pin-input"
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button className="submit-button" onClick={handleLogin}>
              Submit
            </button>
          </div>
        )}
      </div>

      <button 
        className="social-btn apple-login"
        onClick={() => handleFingerprintLogin(handleRegistration)}
      >
        Log in with Apple ID
      </button>
    </div>
  </div>
);
    
  }

export default OnboardingPage;