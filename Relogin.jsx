import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFingerprintLogin as originalFingerprintLogin } from "./fingerprint.js";
import './Relogin.css';

const Relogin = () => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [fingerprintError, setFingerprintError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [fingerprintAttempts, setFingerprintAttempts] = useState(0);
  const maxAttempts = 3;
  const navigate = useNavigate();

  

  // Redirect to AccountLocked if any method reaches max attempts
  useEffect(() => {
    if (pinAttempts >= maxAttempts || fingerprintAttempts >= maxAttempts) {
      navigate('/account-locked');
    }
  }, [pinAttempts, fingerprintAttempts, navigate]);

  // PIN Login
  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (pinAttempts >= maxAttempts) {
      setPinError('❌ Too many incorrect attempts. PIN login disabled.');
      return;
    }

    try {
      setPinError('');
      const res = await fetch('http://localhost:5001/api/auth/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      alert(`✅ Logged in as ${data.user?.name || 'User'}`);
    } catch {
      const attempts = pinAttempts + 1;
      setPinAttempts(attempts);

     