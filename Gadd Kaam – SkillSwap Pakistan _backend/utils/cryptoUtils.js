// utils/cryptoUtils.js
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// Derive a 32-byte encryption key securely from JWT_SECRET or fallback
const getEncryptionKey = () => {
    const rawKey = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'gadd_kaam_super_secure_fallback_encryption_key_32_bytes_long';
    // Hash key to guarantee it is exactly 32 bytes
    return crypto.createHash('sha256').update(rawKey).digest();
};

/**
 * Encrypt a text field using AES-256-CBC
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string in the format "ivHex:encryptedHex"
 */
const encrypt = (text) => {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (err) {
        console.error('Encryption failed:', err.message);
        return text; // Fallback to raw text in case of catastrophic failure
    }
};

/**
 * Decrypt a text field using AES-256-CBC
 * @param {string} encryptedText - Encrypted string formatted as "ivHex:encryptedHex"
 * @returns {string} Plain decrypted text
 */
const decrypt = (encryptedText) => {
    if (!encryptedText) return encryptedText;
    try {
        // If it doesn't match the encrypted pattern "ivHex:encryptedHex", it might be unencrypted legacy data
        if (!encryptedText.includes(':')) return encryptedText;

        const parts = encryptedText.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedTextBuffer = Buffer.from(parts.join(':'), 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
        let decrypted = decipher.update(encryptedTextBuffer, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Decryption failed:', err.message);
        return encryptedText; // Fallback to returning original string
    }
};

module.exports = {
    encrypt,
    decrypt
};
