const {
  scryptSync,
  createDecipheriv,
  randomFill,
  createCipheriv,
} = require("node:crypto");
const { Buffer } = require("node:buffer");

const algorithm = "aes-192-cbc";

const password = process.env.CRYPTO_PASSWORD;
const salt = process.env.CRYPTO_SALT;

// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, salt, 24);
const iv = Buffer.alloc(16, 0);

/**
 *
 * @param {String} encrypted
 */
function decrypt(encrypted) {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 *
 * @param {string} text
 * @returns
 */
function encrypt(text) {
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

/**
 * Compare password has with a plain password string
 * @param {string} hash
 * @param {string} password
 * @returns {boolean}
 */
function compare(hash, password) {
  // decrypt hash
  const decryptedText = decrypt(hash);
  return decryptedText === password;
}

// Example usage:
// const encryptionKey = "myEncryptionKey";
// const plainText = "Hello, World!";

// const encryptedData = encrypt(plainText, encryptionKey);
// console.log("Encrypted:", encryptedData);

// const decryptedText = decrypt(encryptedData, encryptionKey);
// console.log("Decrypted:", decryptedText);

// console.log("Compare:", compare(encryptedData, plainText));

module.exports = {
  decrypt,
  encrypt,
  compare,
};
