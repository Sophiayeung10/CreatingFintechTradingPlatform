// src/fingerprint.js
import { base64UrlToUint8Array, arrayBufferToBase64 } from './base64Utils';

export const handleFingerprintLogin = async (handleRegistration) => {
  if (!window.PublicKeyCredential) {
    alert("Your browser does not support WebAuthn.");
    return;
  }

  try {
    console.log("🔐 Starting authentication...");

    const authChallengeRes = await fetch("http://localhost:5001/api/auth/challenge", {
      credentials: "include",
    });

    if (!authChallengeRes.ok) {
      throw new Error("Failed to get authentication challenge.");
    }

    const authOptions = await authChallengeRes.json();

    if (!authOptions.challenge) {
      throw new Error("Authentication options missing challenge");
    }

    authOptions.challenge = base64UrlToUint8Array(authOptions.challenge);
    if (authOptions.allowCredentials) {
      authOptions.allowCredentials = authOptions.allowCredentials.map((cred) => ({
        ...cred,
        id: base64UrlToUint8Array(cred.id),
      }));
    }

    const assertion = await navigator.credentials.get({ publicKey: authOptions });

    const verifyRes = await fetch("http://localhost:5001/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: assertion.id,
        rawId: arrayBufferToBase64(assertion.rawId),
        response: {
          authenticatorData: arrayBufferToBase64(assertion.response.authenticatorData),
          clientDataJSON: arrayBufferToBase64(assertion.response.clientDataJSON),
          signature: arrayBufferToBase64(assertion.response.signature),
          userHandle: assertion.response.userHandle
            ? arrayBufferToBase64(assertion.response.userHandle)
            : null,
        },
        type: assertion.type,
      }),
    });

    if (!verifyRes.ok) {
      throw new Error("Authentication verification failed.");
    }

    const verifyResult = await verifyRes.json();

    if (!verifyResult.success) {
      throw new Error(verifyResult.message || "Authentication failed.");
    }

    alert(`✅ Login successful! Welcome, ${verifyResult.user?.name || "User"}.`);
  } catch (authErr) {
    console.warn("Authentication failed, trying registration...", authErr);
    // Call registration passed from the component
    await handleRegistration();
  }
};
