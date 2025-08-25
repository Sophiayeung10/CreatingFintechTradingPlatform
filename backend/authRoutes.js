const express = require("express");
const crypto = require("crypto");
const {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require("@simplewebauthn/server");

const router = express.Router();
console.log("✅ authRoutes loaded");

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174'
];

let registrationChallenge = "";
let authenticationChallenge = "";
let storedCredential = null;

const RP_ID = "localhost";
const RP_NAME = "SwingIn App";

// Helpers
function bufferToBase64Url(buffer) {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBuffer(base64url) {
  base64url = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64url.length % 4) base64url += "=";
  return Buffer.from(base64url, "base64");
}

// Ping route
router.get("/ping", (req, res) => {
  res.json({ message: "pong from authRoutes" });
});

// 1. Generate Registration Options
router.get("/register-options", async (req, res) => {
  try {
    const userID = crypto.randomUUID();
    console.log("🔐 Generating registration options for user:", userID);

    // Check if the library is working
    console.log("generateRegistrationOptions function:", typeof generateRegistrationOptions);
    
    // Try a simpler approach first - make it async
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: Buffer.from(userID, 'utf8'),
      userName: "user@example.com",
      userDisplayName: "SwingIn User"
    });

    console.log("Options generated:", options);
    console.log("Options type:", typeof options);
    console.log("Options keys:", Object.keys(options || {}));

    // Store the challenge properly
    registrationChallenge = options?.challenge;
    console.log("✅ Registration options generated successfully");
    console.log("Challenge length:", registrationChallenge ? registrationChallenge.length : 0);
    
    // Convert user ID from Buffer to base64url string
    if (options?.user?.id && Buffer.isBuffer(options.user.id)) {
      options.user.id = bufferToBase64Url(options.user.id);
      console.log("Converted user ID to base64url:", options.user.id);
    }
    
    // Send the options directly
    res.json(options);
  } catch (err) {
    console.error("❌ Registration option error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Failed to generate registration options", details: err.message });
  }
});

// 2. Verify Registration
router.post("/register", async (req, res) => {
  const origin = req.headers.origin;
  const body = req.body;

  console.log("📝 Registration request received from:", origin);
  console.log("Request body keys:", Object.keys(body));

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    console.error("❌ Invalid origin:", origin);
    return res.status(403).json({ success: false, message: "Invalid origin" });
  }

  if (!registrationChallenge) {
    console.error("❌ No registration challenge found");
    return res.status(400).json({ success: false, message: "No registration challenge found" });
  }

  try {
    console.log("🔍 Verifying registration response...");
    
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: registrationChallenge,
      expectedOrigin: origin,
      expectedRPID: RP_ID
    });

    console.log("Verification result:", verification);

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

      storedCredential = {
        credentialID: bufferToBase64Url(credentialID),
        credentialPublicKey,
        counter
      };

      console.log("✅ Registration successful! Credential stored.");
      return res.json({ success: true, message: "Registration successful" });
    }

    console.error("❌ Registration verification failed");
    return res.status(400).json({ success: false, message: "Registration verification failed" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ success: false, message: err.message || "Internal error", details: err.stack });
  }
});

// 3. Generate Authentication Challenge
router.get("/challenge", async (req, res) => {
  try {
    console.log("🔐 Authentication challenge requested");
    
    if (!storedCredential) {
      console.error("❌ No credential registered yet");
      return res.status(400).json({ success: false, message: "No credential registered yet" });
    }

    console.log("✅ Found stored credential, generating challenge...");

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials: [{
        id: base64UrlToBuffer(storedCredential.credentialID),
        type: "public-key",
        transports: ["internal"]
      }],
      userVerification: "required",
      rpID: RP_ID
    });

    authenticationChallenge = options.challenge;
    console.log("✅ Authentication challenge generated successfully");
    res.json(options);
  } catch (err) {
    console.error("❌ Auth challenge error:", err);
    res.status(500).json({ success: false, message: "Failed to generate challenge", details: err.message });
  }
});

// 4. Verify Authentication
router.post("/verify", async (req, res) => {
  const origin = req.headers.origin;
  const body = req.body;

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ success: false, message: "Invalid origin" });
  }

  if (!storedCredential) {
    return res.status(400).json({ success: false, message: "No credential registered yet" });
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: authenticationChallenge,
      expectedOrigin: origin,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: base64UrlToBuffer(storedCredential.credentialID),
        credentialPublicKey: storedCredential.credentialPublicKey,
        counter: storedCredential.counter,
        transports: ["internal"]
      }
    });

    if (verification.verified) {
      storedCredential.counter = verification.authenticationInfo.newCounter;
      return res.json({ success: true });
    }

    return res.status(401).json({ success: false, message: "Authentication failed" });
  } catch (err) {
    console.error("❌ Auth verification error:", err);
    res.status(500).json({ success: false, message: err.message || "Internal error" });
  }
});

// 5. Send Email PIN
router.post("/send-email-pin", async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Missing name or email" });
  }

  const pin = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit PIN
  pinStorage.set(email, pin);

  try {
    await sendEmail(email, pin);
    console.log(`✅ Sent email PIN to ${email}: ${pin}`);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// 6. Verify Email PIN
router.post("/verify-email-pin", (req, res) => {
  const { email, pin } = req.body;
  const stored = pinStorage.get(email);
  if (!stored || stored !== pin) {
    return res.status(400).json({ success: false, message: "Invalid or expired PIN" });
  }

  console.log(`✅ Email PIN verified for ${email}`);
  pinStorage.clear(email);
  res.status(200).json({ success: true, message: "Email verified" });
});

module.exports = router;