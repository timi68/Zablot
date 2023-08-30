// password encryption and verification using bcrypt library

import bcrypt from "bcrypt";
import HttpError from "@lib/httpError";
import { scryptSync, createDecipheriv, createCipheriv } from "crypto";
import { Buffer } from "buffer";
import { STATUS } from "@lib/constants";

const algorithm = "aes-192-cbc";

const password = process.env.CRYPTO_PASSWORD as string;
const salt = process.env.CRYPTO_SALT as string;

// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, salt, 24);
const iv = Buffer.alloc(16, 0);
const saltRounds = 10;

/**
 * decrypt encrypted password from the database
 */
export function decrypt(encrypted: string) {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * encrypt plain password
 */
export function encrypt(text: string) {
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

/**
 * Compare password has with a plain password string
 */
export function compare(hash: string, password: string): boolean {
  // decrypt hash
  const decryptedText = decrypt(hash);
  return decryptedText === password;
}

/**
 * hash registered user provided password
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashSalt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(String(password), hashSalt);

    return hashed;
  } catch (error: any) {
    console.error(error);
    throw new HttpError(error.message, STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Compare body password with database password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return bcrypt.compare(String(password), hashedPassword);
  } catch (error) {
    return false;
  }
}
