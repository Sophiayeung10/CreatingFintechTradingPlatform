// Simple in-memory PIN storage

const pinStore = {
  emailPins: new Map(),  // key: email, value: pin
  phonePins: new Map(),  // key: phone, value: pin
};

/**
 * Save a PIN for an email
 * @param {string} email 
 * @param {string} pin 
 */
function saveEmailPin(email, pin) {
  pinStore.emailPins.set(email, pin);
}

/**
 * Get PIN for an email
 * @param {string} email 
 * @returns {string | undefined} pin
 */
function getEmailPin(email) {
  return pinStore.emailPins.get(email);
}

/**
 * Remove PIN for an email
 * @param {string} email 
 */
function removeEmailPin(email) {
  pinStore.emailPins.delete(email);
}

/**
 * Save a PIN for a phone
 * @param {string} phone 
 * @param {string} pin 
 */
function savePhonePin(phone, pin) {
  pinStore.phonePins.set(phone, pin);
}

/**
 * Get PIN for a phone
 * @param {string} phone 
 * @returns {string | undefined} pin
 */
function getPhonePin(phone) {
  return pinStore.phonePins.get(phone);
}

/**
 * Remove PIN for a phone
 * @param {string} phone 
 */
function removePhonePin(phone) {
  pinStore.phonePins.delete(phone);
}

module.exports = {
  saveEmailPin,
  getEmailPin,
  removeEmailPin,
  savePhonePin,
  getPhonePin,
  removePhonePin,
};
