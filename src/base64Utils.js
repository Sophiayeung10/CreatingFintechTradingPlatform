// Convert base64url string to Uint8Array for WebAuthn
    export const base64UrlToUint8Array = (base64url) => {
      if (!base64url) {
        throw new Error("Challenge is missing from registration options");
      }
      
      const padding = "=".repeat((4 - (base64url.length % 4)) % 4);
      const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    };

    // Convert ArrayBuffer to base64url string
    export const arrayBufferToBase64 = (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return window
        .btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    };