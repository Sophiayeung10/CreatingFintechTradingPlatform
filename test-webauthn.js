const crypto = require("crypto");

console.log("Testing @simplewebauthn/server library...");

// Try different import methods
let generateRegistrationOptions;
try {
  const webauthn = require("@simplewebauthn/server");
  generateRegistrationOptions = webauthn.generateRegistrationOptions;
  console.log("✅ Import successful");
  console.log("Available exports:", Object.keys(webauthn));
} catch (error) {
  console.error("❌ Import failed:", error.message);
  process.exit(1);
}

try {
  const userID = crypto.randomUUID();
  console.log("User ID:", userID);
  
  // Try with minimal configuration
  const options = generateRegistrationOptions({
    rpName: "Test App",
    rpID: "localhost",
    userID: userID, // Try string instead of Buffer
    userName: "test@example.com",
    userDisplayName: "Test User"
  });
  
  console.log("Options generated successfully!");
  console.log("Options:", JSON.stringify(options, null, 2));
  console.log("Options keys:", Object.keys(options));
  console.log("Challenge:", options.challenge ? "Present" : "Missing");
  console.log("User:", options.user);
  console.log("RP:", options.rp);
} catch (error) {
  console.error("Error:", error.message);
  console.error("Stack:", error.stack);
} 