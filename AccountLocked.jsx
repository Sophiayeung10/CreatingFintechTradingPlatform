// AccountLocked.jsx
import './AccountLocked.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountLocked = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSendReactivationPin = () => {
    const identifier = email || phone;

    if (email && phone) {
    alert("You can enter only email OR phone!");
    return;
  }

    if (!identifier) {
      alert("Please enter your email or phone number.");
      return;
    }

    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    // simulated PIN number
    localStorage.setItem("generatedPin", generated);
    localStorage.setItem("identifier", identifier);

    alert(`Reactivation PIN sent to ${identifier}: ${generated} (simulated)`);
    navigate("/enter-pin"); //to EnterPin.jsx
  };

  return (
    <div className="account-locked-container">
      <h2>Account Locked</h2>
      <p>Please enter your email or phone number to receive a reactivation PIN.</p>
      
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p>OR</p>
      <input
        type="tel"
        placeholder="Enter Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSendReactivationPin}>Send PIN</button>
    </div>
  );
};

export default AccountLocked;
