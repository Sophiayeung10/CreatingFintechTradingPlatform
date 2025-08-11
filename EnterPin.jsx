import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterPin.css';

const EnterPin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto focus next input
      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredPin = pin.join('');
    const generatedPin = localStorage.getItem('generatedPin');

    if (enteredPin === generatedPin) {
      alert('✅ PIN verified successfully!');
      // Proceed to next step
    } else {
      alert('❌ Incorrect PIN. Please try again.');
    }
  };

  return (
    <div className="enter-pin-container">
      <h2>Please enter your PIN</h2>
      <div className="pin-inputs">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            ref={(el) => (inputsRef.current[idx] = el)}
          />
        ))}
      </div>
      <button className="verify-btn" onClick={handleVerify}>Verify</button>
      <p 
        className="return-link" 
        onClick={() => navigate('/account-locked')}
      >
        Return to Account Locked
      </p>
    </div>
  );
};

export default EnterPin;
